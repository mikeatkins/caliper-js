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

var config = require('../../config/config');

var metric =  {
    assessmentsPassed: {
        context: config.jsonldContext.v1p1_toolUse,
        term: "AssessmentsPassed",
        iri: "http://purl.imsglobal.org/caliper/AssessmentsPassed"},
    assessmentsSubmitted: {
        context: config.jsonldContext.v1p1_toolUse,
        term: "AssessmentsSubmitted",
        iri: "http://purl.imsglobal.org/caliper/AssessmentsSubmitted"},
    minutesOnTask: {
        context: config.jsonldContext.v1p1_toolUse,
        term: "MinutesOnTask",
        iri: "http://purl.imsglobal.org/caliper/MinutesOnTask"},
    skillsMastered: {
        context: config.jsonldContext.v1p1_toolUse,
        term: "SkillsMastered",
        iri: "http://purl.imsglobal.org/caliper/SkillsMastered"},
    standardsMastered: {
        context: config.jsonldContext.v1p1_toolUse,
        term: "StandardsMastered",
        iri: "http://purl.imsglobal.org/caliper/StandardsMastered"},
    unitsCompleted: {
        context: config.jsonldContext.v1p1_toolUse,
        term: "UnitsCompleted",
        iri: "http://purl.imsglobal.org/caliper/UnitsCompleted"},
    unitsPassed: {
        context: config.jsonldContext.v1p1_toolUse,
        term: "UnitsPassed",
        iri: "http://purl.imsglobal.org/caliper/UnitsPassed"},
    wordsRead: {
        context: config.jsonldContext.v1p1_toolUse,
        term: "WordsRead",
        iri: "http://purl.imsglobal.org/caliper/WordsRead"}
};

module.exports = metric;