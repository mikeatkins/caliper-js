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

var validator = require('./validator');

/**
 * Check if Delegate @context value retains a higher precedence than the opts @context value(s). If not, replace.
 * This situation can occur with Events that have been extended with new profile "extension" terms
 * (ex. Tool Use Profile).
 * @param delegate
 * @param opts
 * @returns {*}
 */
function checkContextPrecedence(delegate, opts) {
  return validator.checkContextPrecedence(delegate, opts);
}

/**
 * Check required Entity properties against set of user-supplied values
 * @param delegate
 * @param opts
 * @returns {*}
 */
function checkRequiredPropertyValues(delegate, opts) {
  Object.keys(opts).forEach(function(key) {
    switch (key) {
      case "type":
        if (validator.hasType(delegate)) {
          delete opts[key]; // suppress
        }
        break;
      case "id":
        if (!validator.hasUri(opts)) {
          throw new Error("Required identifier not provided");
        }
        break;
    }
  });
  return opts;
}

module.exports = {
  checkContextPrecedence: checkContextPrecedence,
  checkRequiredPropertyValues: checkRequiredPropertyValues
};