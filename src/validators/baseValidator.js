/*
 * This file is part of IMS Caliper Analytics™ and is licensed to
 * IMS Global Learning Consortium, Inc. (http://www.imsglobal.org)
 * under one or more contributor license agreements.  See the NOTICE
 * file distributed with this work for additional information.
 *
 * IMS Caliper is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * IMS Caliper is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with this program. If not, see http://www.gnu.org/licenses/.
 */

var _ = require('lodash');
var moment = require('moment');
var uuid = require('node-uuid');
var urijs = require('uri-js');
var validator = require('validator');
var contexts = require('../config/contexts');
var config = require('../config/config');

const regex = RegExp('http:\\/\\/purl.imsglobal.org\\/ctx\\/caliper\\/?v?[0-9]*p?[0-9]*');

/**
 * Check if any Delegate Caliper @context (event, entity) values possess a higher precedence than the opts @context
 * value(s). The operation is recursive and will check all entities that comprise the event. If a @context value with
 * a higher precedence is encountered it will replace the current opts @context value.
 * @param delegate
 * @param opts
 * @returns {*}
 */
function checkContextPrecedence(delegate, opts) {
  var delegatePrecedence = getContextPrecedence(delegate['@context']);

  Object.keys(opts).forEach(function(key) {
    if (key === '@context') {
      switch (checkObjectType(opts[key])) {
        case '[object String]':
          if (hoistContext(opts[key], delegatePrecedence)) {
            delegate['@context'] = opts[key]
          }
          delete opts[key]; // entity context now redundant
          break;
        case '[object Array]':
          for (var i = 0, len = opts[key].length; i < len; i++) {
            if (checkObjectType(opts[key][i]) === '[object String]') {
              if (hoistContext(opts[key][i], delegatePrecedence)) {
                delegate['@context'] = opts[key][i]
              }
              // delete opts[key] // do not delete
            }
          }
          break;
        case '[object Object]':
          if (opts[key].hasOwnProperty('@vocab')) {
            if (hoistContext(opts[key]['@vocab'], delegatePrecedence)) {
              delegate['@context'] = opts[key]['@vocab']
            }
            // delete opts[key] // do not delete
          }

          if (opts[key].hasOwnProperty('@base')) {
            if (hoistContext(opts[key]['@base'], delegatePrecedence)) {
              delegate['@context'] = opts[key]['@base']
            }
            // delete opts[key] // do not delete
          }
          break;
      }
    } else {
      if (typeof opts[key] == 'object' && opts[key] !== null) {
        checkContextPrecedence(delegate, opts[key]); // recursive
      }

    }
  });
  return delegate;
}

/**
 * Check Javascript object type.
 * @param opts
 * @returns {*}
 */
function checkObjectType(opts) {
  return Object.prototype.toString.call(opts);
}

/**
 * Generate a RFC 4122 v1 timestamp-based UUID or a v4 "practically random" UUID.  Default is v4.
 * @returns {*}
 */
function generateUUID(version) {
  version = version || config.uuidVersion;

  switch(version) {
    case 4:
      return uuid.v4();
    case 1:
      return uuid.v1();
    default:
      return uuid.v4();
  }
}

/**
 * Return Caliper JSON-LD context precedence
 * @param obj
 * @returns {number}
 */
function getContextPrecedence(contextIRI) {
  var precedence = 0;
  for (var i = 0; i < contexts.length; i++) {
    if (contexts[i].iri == contextIRI) {
      precedence = contexts[i].precedence;
      break;
    }
  }
  return precedence;
}

/**
 * Check action
 * @param opts
 * @returns {boolean}
 */
function hasAction(opts) {
  // TODO lookup action based on event
  return !(_.isNil(opts.action) && _.isEmpty(opts.action));
}

/**
 * Check actor
 * @param opts
 */
function hasActor(opts) {
  return !_.isNil(opts.actor);
}

/**
 * Check if object JSON-LD context IRI precedence trumps delegate context precedence.
 * @param contextIRI
 * @param delegatePrecedence
 * @returns {boolean}
 */
function hasContextPrecedence(contextIRI, delegatePrecedence) {
  var objPrecedence = getContextPrecedence(contextIRI);
  return objPrecedence > delegatePrecedence ? true : false;
}

/**
 * Check if eventTime is null, undefined or invalid.
 * @param opts
 * @returns {boolean|*}
 */
function hasEventTime(opts) {
  var hasDateTime = false;
  if (!(_.isNil(opts.eventTime) && _.isEmpty(opts.eventTime))) {
    if (moment.isMoment(opts.eventTime)) {
      hasDateTime = true;
    } else {
      hasDateTime = moment(opts.eventTime).isValid();
      //hasDateTime = isISO8601(opts.eventTime);
    }
  }
  return hasDateTime;
}

/**
 * Check if id is undefined, null or empty.  Given that nearly any string could constitute a URI
 * @param opts
 * @returns {boolean}
 */
function hasId(opts) {
  return !(_.isNil(opts.id) && _.isEmpty(opts.id));
}

/**
 * Check object
 * @param opts
 * @returns {boolean}
 */
function hasObject(opts) {
  return !_.isNil(opts.object);
}

/**
 * Check if type is undefined, null or empty.
 * @param opts
 * @returns {boolean}
 */
function hasType(opts) {
  return !(_.isNil(opts.type) && _.isEmpty(opts.type));
}

/**
 * Check if String can be parsed as a URI
 * @type {exports.hasURI}
 */
function hasUri(opts) {
  if (!(_.isNil(opts.id))) {
    var uri = urijs.parse(opts.id);

    if (!(_.isNil(uri.error))) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

/**
 * Check if string is a UUID URN.
 * @type {exports.isUri}
 */
function hasUuidUrn(opts) {
  if (!(_.isNil(opts.id))) {
    var uri = urijs.parse(opts.id);
    return uri.scheme == "urn" && uri.nid == "uuid" && isUuid(uri.uuid) ? true : false;
  } else {
    return false;
  }
}

/**
 * Replace Delegate context value if object context value precedence is greater.
 * @param contextIRI
 * @param delegatePrecedence
 * @returns {boolean}
 */
function hoistContext(contextIRI, delegatePrecedence) {
  return isCaliperContext(contextIRI) && hasContextPrecedence(contextIRI, delegatePrecedence);
}

/**
 * Check if string is a blank node.
 * @type {exports.isBlankNode}
 */
function isBlankNode(opts) {
  if (!(_.isNil(opts.id))) {
    return _.startsWith("_:");
  } else {
    return false;
  }
}

/**
 * Check if JSON-LD @context string value is a Caliper context.
 * @param val
 * @returns {boolean}
 */
function isCaliperContext(val) {
  return regex.test(val);
}

/**
 * Check if date string is ISO 8601 compliant.
 * @param str
 * @returns {*}
 */
function isISO8601(str) {
  return validator.isISO8601(str);
}

/**
 * Validate UUID value. validator.isUUID(str [, version]) - check if the string is a UUID (version 3, 4 or 5).
 * @param uuid
 * @returns {*}
 */
function isUuid(uuid) {
  return validator.isUUID(uuid);
}

/**
 * Check for top-level user-defined custom Entity properties against linked proto own and inherited
 * enumerable property keys (using _.keysIn()) and move custom properties to Entity.extensions. Use the
 * good 'ole for loop in preference to the for..in loop in order to avoid iterating over both enumerable
 * and inherited properties of the opts object.
 * @param proto
 * @param opts
 * @returns {*}
 */
function moveToExtensions(proto, opts) {
  var protoKeys = _.keysIn(proto);
  var optsKeys = _.keys(opts);
  var opts = {};

  for (var i = 0, len = optsKeys.length; i < len; i++) {
    var optsPropName = optsKeys[i];
    if (protoKeys.indexOf(optsPropName) == -1) {
      var customProp = opts[optsPropName];
      var customKeys = _.keys(customProp);
      for (var i = 0, len = customKeys.length; i < len; i++) {
        if (customKeys[i] == '@context') {
          if (typeof customProp['@context'] === 'object') {
            if (opts.hasOwnProperty('@context')) {
              opts['@context'] = _.assign({}, opts['@context'], customProp['@context']);
            } else {
              opts['@context'] = customProp['@context'];
            }
          }
        } else {
          opts[customKeys[i]] = customProp[customKeys[i]];
        }
        delete opts[optsPropName];
      }
    }
  }

  if (opts.hasOwnProperty("extensions")) {
    opts.extensions = _.assign({}, opts.extensions, opts);
  } else {
    opts.extensions = opts;
  }

  return opts;
}

/**
 * Remove @context property if value corresponds to the IMS Caliper context IRI.
 * @param obj
 * @returns {*}
 */
function removeContext(obj) {
  if (obj.hasOwnProperty("@context")) {
    if (isCaliperContext(obj["@context"])) {
      delete obj["@context"];
    }
  }
  return obj;
}

module.exports = {
  checkContextPrecedence: checkContextPrecedence,
  checkObjectType: checkObjectType,
  generateUUID: generateUUID,
  hasAction: hasAction,
  hasActor: hasActor,
  hasEventTime: hasEventTime,
  hasId: hasId,
  hasObject: hasObject,
  hasType: hasType,
  hasUri: hasUri,
  hasUuidUrn: hasUuidUrn,
  isBlankNode: isBlankNode,
  isCaliperContext: isCaliperContext,
  isISO8601: isISO8601,
  isUuid: isUuid,
  moveToExtensions: moveToExtensions,
  removeContext: removeContext
};