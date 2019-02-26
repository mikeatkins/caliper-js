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

var config = require('../config/config');
var contexts = require('../config/contexts');
var validator = require('./validator');


function hoistContext(delegate, opts) {
  const regex = RegExp('http:\\/\\/purl.imsglobal.org\\/ctx\\/caliper\\/?v?[0-9]*p?[0-9]*');

  //1. Check type
  //2. If extension
  //3. Check payload for entities that default to extension
  //4. Check entity type
  //4. If found update event context

  var delegatePrecedence = checkContextPrecedence(delegate["@context"]);
  // console.log("Delegate Precedence =", delegatePrecedence);

  for (var key in opts) {
    if (opts.hasOwnProperty(key)) {
      if (typeof opts[key] == "object" && opts[key] !== null) {
        hoistContext(delegate, opts[key]); // recursive
      }
      else {
        if (key == "@context") {
          if (regex.test(opts[key]) && opts[key] != delegate["@context"]) {
            var optsPrecedence = checkContextPrecedence(opts[key]);
            // console.log("Opts Precedence =", optsPrecedence);

            if (optsPrecedence > delegatePrecedence) {
              // console.log("Opts Precedence is greater");
              delegate["@context"] = opts[key] // hoist
            }
          }
        }
      }
    } else {
      continue;
    }
  }

  return delegate;
}

/**
 * Return Caliper JSON-LD context precedence
 * @param obj
 * @returns {number}
 */
function checkContextPrecedence(val) {

  // TODO val could be string, obj, or array

  var precedence = 0;
  for (var i = 0; i < contexts.length; i++) {
    if (contexts[i].iri == val) {
      precedence = contexts[i].precedence;
      break;
    }
  }
  return precedence;
}

/**
 * Check required Event properties against set of user-supplied values
 * @param delegate
 * @param opts
 * @returns {*}
 */
function checkOpts(delegate, opts) {
  Object.keys(delegate).forEach(function(key) {
    switch (key) {
      case "@context":
        if (validator.hasCaliperContext(delegate)) {
          delete opts['@context']; // suppress
        }
        break;
      case "type":
        if (validator.hasType(delegate)) {
          delete opts.type; // suppress
        } else {
          if (!validator.hasType(opts.type)) {
            throw new Error("Required type not provided");
          }
        }
        break;
      case "id":
        if (!validator.hasUuidUrn(opts)) {
          opts.id = "urn:uuid:" + validator.generateUUID(config.uuidVersion);
        }
        break;
      case "actor":
        if (!validator.hasActor(opts)) {
          throw new Error("Required actor not provided");
        }
        break;
      case "action":
        if (!validator.hasAction(opts)) {
          throw new Error("Required action not provided");
        }
        break;
      case "object":
        if (!validator.hasObject(opts)) {
          throw new Error("Required object not provided");
        }
        break;
      case "eventTime":
        if (!validator.hasEventTime(opts)) {
          throw new Error("Required ISO 8601 formatted eventTime not provided");
        }
        break;
    }
  });
  return opts;
};

module.exports = {
  hoistContext: hoistContext,
  checkOpts: checkOpts
};