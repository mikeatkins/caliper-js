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
var test = require('tape');

var config = require('../../src/config/config');
var eventFactory = require('../../src/events/eventFactory');
var validator = require('../../src/validators/validator');
var ToolUseEvent = require('../../src/events/toolUseEvent');
var actions = require('../../src/actions/actions');

var entityFactory = require('../../src/entities/entityFactory');
var AggregateMeasure = require('../../src/entities/use/aggregateMeasure');
var AggregateMeasureCollection = require('../../src/entities/use/aggregateMeasureCollection');
var CourseOffering = require('../../src/entities/agent/courseOffering');
var CourseSection = require('../../src/entities/agent/courseSection');
var Membership = require('../../src/entities/agent/membership');
var metric = require('../../src/entities/use/metric');
var Person = require('../../src/entities/agent/person');
var Role = require('../../src/entities/agent/role');
var Session = require('../../src/entities/session/session');
var SoftwareApplication = require('../../src/entities/agent/softwareApplication');
var Status = require('../../src/entities/agent/status');
var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + "caliperEventToolUseUsedWithProgress.json";

testUtils.readFile(path, function(err, fixture) {
    if (err) throw err;

    test('toolUseEventUsedWithProgressTest', function (t) {

        // Plan for N assertions
        t.plan(1);

        var BASE_IRI = "https://example.edu";
        var BASE_COURSE_IRI = "https://example.edu/terms/201601/courses/7";
        var BASE_SECTION_IRI = "https://example.edu/terms/201601/courses/7/sections/1";

        // Id with canned value
        uuid = "urn:uuid:7e10e4f3-a0d8-4430-95bd-783ffae4d916";

        // The Actor
        var actor = entityFactory().create(Person, {id: BASE_IRI.concat("/users/554433")});

        // The Action
        var action = actions.used.term;

        // The Object of the interaction
        var obj = entityFactory().create(SoftwareApplication, {id: BASE_IRI});

        // Event time
        var eventTime = moment.utc("2019-11-15T10:15:00.000Z");

        // edApp
        var edApp = obj.id;

        // Generated Progress
        var measure01 = entityFactory().create(AggregateMeasure, {
            id: "urn:uuid:21c3f9f2-a9ef-4f65-bf9a-0699ed85e2c7",
            name: "Minutes On Task",
            metric: metric.minutesOnTask.term,
            metricValue: 873.0,
            startedAtTime: moment.utc("2019-08-15T10:15:00.000Z"),
            endedAtTime: moment.utc("2019-11-15T10:15:00.000Z")
        });

        var measure02 = entityFactory().create(AggregateMeasure, {
            id: "urn:uuid:c3ba4c01-1f17-46e0-85dd-1e366e6ebb81",
            name: "Units Completed",
            metric: metric.unitsCompleted.term,
            metricValue: 12.0,
            maxMetricValue: 25.0,
            startedAtTime: moment.utc("2019-08-15T10:15:00.000Z"),
            endedAtTime: moment.utc("2019-11-15T10:15:00.000Z")
        });

        var measures = [];
        measures.push(measure01);
        measures.push(measure02);

        var generated = entityFactory().create(AggregateMeasureCollection, {
            id: "urn:uuid:7e10e4f3-a0d8-4430-95bd-783ffae4d912",
            items: measures
        });

        // Group
        var courseOffering = entityFactory().create(CourseOffering, {
            id: BASE_COURSE_IRI,
            courseNumber: "CPS 435"
        });

        var group = entityFactory().create(CourseSection, {
            id: BASE_SECTION_IRI,
            courseNumber: "CPS 435-01",
            name: "CPS 435 Learning Analytics, Section 01",
            academicSession: "Fall 2016",
            category: "seminar",
            subOrganizationOf: courseOffering,
            dateCreated: moment.utc("2016-08-01T06:00:00.000Z")
        });

        // The Actor's Membership
        var organization = entityFactory().create(CourseSection, {
            id: group.id,
            subOrganizationOf: entityFactory().create(CourseOffering, {
                id: courseOffering.id
            })
        });

        var membership = entityFactory().create(Membership, {
            id: BASE_SECTION_IRI.concat("/rosters/1/members/554433"),
            member: actor,
            organization: organization,
            roles: [Role.learner.term],
            status: Status.active.term,
            dateCreated: moment.utc("2016-11-01T06:00:00.000Z")
        });

        // Session
        var session = entityFactory().create(Session, {
            id: BASE_IRI.concat("/sessions/1f6442a482de72ea6ad134943812bff564a76259"),
            user: actor,
            startedAtTime: moment.utc("2016-09-15T10:00:00.000Z")
        });

        // Assert that key attributes are the same
        var event = eventFactory().create(ToolUseEvent, {
            id: uuid,
            actor: actor,
            action: action,
            object: obj,
            eventTime: eventTime,
            edApp: edApp,
            generated: generated,
            group: group,
            membership: membership,
            session: session
        });

        // Compare
        var diff = testUtils.compare(fixture, clientUtils.parse(event));
        var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");

        t.equal(true, _.isUndefined(diff), diffMsg);
        //t.end();
    });
});