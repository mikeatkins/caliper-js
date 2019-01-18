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
var SearchEvent = require('../../src/events/searchEvent');
var actions = require('../../src/actions/actions');

// Entity
var entityFactory = require('../../src/entities/entityFactory');
var CourseSection = require('../../src/entities/agent/courseSection');
var Membership = require('../../src/entities/agent/membership');
var Person = require('../../src/entities/agent/person');
var Query =  require('../../src/entities/search/query');
var Role = require('../../src/entities/agent/role');
var SearchResponse =  require('../../src/entities/search/searchResponse');
var Session = require('../../src/entities/session/session');
var SoftwareApplication = require('../../src/entities/agent/softwareApplication');
var Status = require('../../src/entities/agent/status');
var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + "caliperEventSearchSearched.json";

testUtils.readFile(path, function(err, fixture) {
    if (err) throw err;

    test('searchEventSearchedResponseTest', function (t) {

        // Plan for N assertions
        t.plan(1);

        var BASE_IRI = "https://example.edu";
        var BASE_SECTION_IRI = "https://example.edu/terms/201801/courses/7/sections/1";

        // Id with canned value
        uuid = "urn:uuid:cb3878ed-8240-4c6d-9fee-77221810f5e4";

        // The Actor
        var actor = entityFactory().create(Person, {id: BASE_IRI.concat("/users/554433")});

        // The Action
        var action = actions.searched.term;

        // The Object of the interaction
        var obj = entityFactory().create(SoftwareApplication, {id: "https://example.edu/catalog"});

        // Event time
        var eventTime = moment.utc("2018-11-15T10:05:00.000Z");

        // Query submitted
        var query = entityFactory().create(Query, {
            id: "https://example.edu/users/554433/search?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29",
            creator: actor.id,
            searchTarget: "https://example.edu/catalog",
            searchTerms: "IMS AND (Caliper OR Analytics)",
            dateCreated: moment.utc("2018-11-15T10:05:00.000Z")

        });

        // Generated SearchResponse
        var generated = entityFactory().create(SearchResponse, {
            id: "https://example.edu/users/554433/response?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29",
            searchProvider: "https://example.edu",
            searchTarget: "https://example.edu/catalog",
            query: query,
            searchResultsItemCount: 3,
            searchResults: [
                "https://example.edu/catalog/record/01234?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29",
                "https://example.edu/catalog/record/09876?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29",
                "https://example.edu/catalog/record/05432?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29"
            ]
        });

        // The edApp
        var edApp = entityFactory().coerce(SoftwareApplication, {id: BASE_IRI});

        // Group
        var group = entityFactory().create(CourseSection, {
            id: BASE_SECTION_IRI,
            courseNumber: "CPS 435-01",
            academicSession: "Fall 2018"
        });

        // Membership
        var membership = entityFactory().create(Membership, {
            id: BASE_SECTION_IRI.concat("/rosters/1"),
            member: actor.id,
            organization: group.id,
            roles: [Role.learner.term],
            status: Status.active.term,
            dateCreated: moment.utc("2018-08-01T06:00:00.000Z")
        });

        // Session
        var session = entityFactory().create(Session, {
            id: BASE_IRI.concat("/sessions/1f6442a482de72ea6ad134943812bff564a76259"),
            startedAtTime: moment.utc("2018-11-15T10:00:00.000Z")
        });

        // Assert that key attributes are the same
        var event = eventFactory().create(SearchEvent, {
            id: uuid,
            actor: actor,
            action: action,
            object: obj,
            eventTime: eventTime,
            generated: generated,
            edApp: edApp,
            group: group,
            membership: membership,
            session: session
        });

        // Compare
        var diff = testUtils.compare(fixture, clientUtils.parse(event));
        var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");

        t.equal(true, _.isUndefined(diff), diffMsg);
        ////t.end();
    });
});