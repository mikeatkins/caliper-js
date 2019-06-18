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
var FeedbackEvent = require('../../src/events/feedbackEvent');
var actions = require('../../src/actions/actions');

var entityFactory = require('../../src/entities/entityFactory');
var Comment = require('../../src/entities/survey/comment');
var CourseSection = require('../../src/entities/agent/courseSection');
var DigitalResource = require('../../src/entities/resource/digitalResource');
var DigitalResourceCollection = require('../../src/entities/resource/digitalResourceCollection');
var LikertScale = require('../../src/entities/scale/likertScale');
var Membership = require('../../src/entities/agent/membership');
var Person = require('../../src/entities/agent/person');
var Rating = require('../../src/entities/survey/rating');
var RatingScaleQuestion = require('../../src/entities/question/RatingScaleQuestion');
var Role = require('../../src/entities/agent/role');
var Session = require('../../src/entities/session/session');
var SoftwareApplication = require('../../src/entities/agent/softwareApplication');
var Status = require('../../src/entities/agent/status');
var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + "caliperEventFeedbackRanked.json";

testUtils.readFile(path, function(err, fixture) {
    if (err) throw err;

    test('feedbackEventRankedTest', function (t) {

        // Plan for N assertions
        t.plan(1);

        var BASE_IRI = "https://example.edu";
        var BASE_SECTION_IRI = "https://example.edu/terms/201801/courses/7/sections/1";

        // Id with canned value
        uuid = "urn:uuid:a502e4fc-24c1-11e9-ab14-d663bd873d93";

        // The Actor
        var actor = entityFactory().create(Person, {id: BASE_IRI.concat("/users/554433")});

        // Group
        var group = entityFactory().create(CourseSection, {
            id: BASE_SECTION_IRI,
            courseNumber: "CPS 435-01",
            academicSession: "Fall 2018"
        });

        // The Action
        var action = actions.ranked.term;

        // DigitalResourceCollection
        var collection = entityFactory().create(DigitalResourceCollection, {
            id: BASE_SECTION_IRI.concat("/resources/1"),
            name: "Course Assets",
            isPartOf: entityFactory().create(CourseSection, {id: group.id})
        });

        // The Object of the interaction
        var obj = entityFactory().create(DigitalResource, {
            id: BASE_SECTION_IRI.concat("/resources/1/syllabus.pdf"),
            name: "Course Syllabus",
            mediaType: "application/pdf",
            isPartOf: collection,
            dateCreated: moment.utc("2018-08-02T11:32:00.000Z")
        });

        // Event time
        var eventTime = moment.utc("2018-11-15T10:05:00.000Z");

        var likertScale = entityFactory().create(LikertScale, {
            id: BASE_IRI.concat("/scale/2"),
            scalePoints: 4,
            itemLabels: ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"],
            itemValues: ["-2", "-1", "1", "2"]
        });

        var comment = entityFactory().create(Comment, {
            id: BASE_SECTION_IRI.concat("/assess/1/items/6/users/665544/responses/1/comment/1"),
            commenter: actor,
            commentedOn: obj,
            value: "I like what you did here but you need to improve on...",
            dateCreated: moment.utc("2018-08-01T06:00:00.000Z")
        });

        var question = entityFactory().create(RatingScaleQuestion, {
            id: BASE_IRI.concat("/question/2"),
            questionPosed: "Do you agree with the opinion presented?",
            scale: likertScale
        });

        var generated = entityFactory().create(Rating, {
            id: BASE_IRI.concat("/users/554433/rating/1"),
            rater: actor,
            rated: obj,
            question: question,
            selections: ["1"],
            ratingComment: comment,
            dateCreated: moment.utc("2018-08-01T06:00:00.000Z")
        });

        // The edApp
        var edApp = entityFactory().coerce(SoftwareApplication, {id: BASE_IRI});

        // The Actor's Membership
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
        var event = eventFactory().create(FeedbackEvent, {
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
        //t.end();
    });
});

/**
 {
  "@context": "http://purl.imsglobal.org/ctx/caliper/v1p1/FeedbackProfile-extension",
  "id": "urn:uuid:a502e4fc-24c1-11e9-ab14-d663bd873d93",
  "type": "FeedbackEvent",
  "actor": {
    "id": "https://example.edu/users/554433",
    "type": "Person"
  },
  "action": "Ranked",
  "object": {
    "id": "https://example.edu/terms/201801/courses/7/sections/1/resources/1/syllabus.pdf",
    "type": "DigitalResource",
    "name": "Course Syllabus",
    "mediaType": "application/pdf",
    "isPartOf": {
      "id": "https://example.edu/terms/201801/courses/7/sections/1/resources/1",
      "type": "DigitalResourceCollection",
      "name": "Course Assets",
      "isPartOf": {
        "id": "https://example.edu/terms/201801/courses/7/sections/1",
        "type": "CourseSection"
      }
    },
    "dateCreated": "2018-08-02T11:32:00.000Z"
  },
  "generated": {
    "id": "https://example.edu/users/554433/rating/1",
    "type": "Rating",
    "rater": {
      "id": "https://example.edu/users/554433",
      "type": "Person"
    },
    "rated": {
      "id": "https://example.edu/terms/201801/courses/7/sections/1/resources/1/syllabus.pdf",
      "type": "DigitalResource",
      "name": "Course Syllabus",
      "mediaType": "application/pdf",
      "isPartOf": {
        "id": "https://example.edu/terms/201801/courses/7/sections/1/resources/1",
        "type": "DigitalResourceCollection",
        "name": "Course Assets",
        "isPartOf": {
          "id": "https://example.edu/terms/201801/courses/7/sections/1",
          "type": "CourseSection"
        }
      },
      "dateCreated": "2018-08-02T11:32:00.000Z"
    },
    "question": {
      "id": "https://example.edu/question/2",
      "type": "RatingScaleQuestion",
      "questionPosed": "Do you agree with the opinion presented?",
      "scale": {
        "id": "https://example.edu/scale/2",
        "type": "LikertScale",
        "scalePoints": 4,
        "itemLabels": ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"],
        "itemValues": ["-2", "-1", "1", "2"]
      }
    },
    "selections": ["1"],
    "ratingComment": {
      "id": "https://example.edu/terms/201801/courses/7/sections/1/assess/1/items/6/users/665544/responses/1/comment/1",
      "type": "Comment",
      "commenter": {
        "id": "https://example.edu/users/554433",
        "type": "Person"
      },
      "commentedOn": {
        "id": "https://example.edu/terms/201801/courses/7/sections/1/resources/1/syllabus.pdf",
        "type": "DigitalResource",
        "name": "Course Syllabus",
        "mediaType": "application/pdf",
        "isPartOf": {
          "id": "https://example.edu/terms/201801/courses/7/sections/1/resources/1",
          "type": "DigitalResourceCollection",
          "name": "Course Assets",
          "isPartOf": {
            "id": "https://example.edu/terms/201801/courses/7/sections/1",
            "type": "CourseSection"
          }
        },
        "dateCreated": "2018-08-02T11:32:00.000Z"
      },
      "value": "I like what you did here but you need to improve on...",
      "dateCreated": "2018-08-01T06:00:00.000Z"
    },
    "dateCreated": "2018-08-01T06:00:00.000Z"
  },
  "eventTime": "2018-11-15T10:05:00.000Z",
  "edApp": "https://example.edu",
  "group": {
    "id": "https://example.edu/terms/201801/courses/7/sections/1",
    "type": "CourseSection",
    "courseNumber": "CPS 435-01",
    "academicSession": "Fall 2018"
  },
  "membership": {
    "id": "https://example.edu/terms/201801/courses/7/sections/1/rosters/1",
    "type": "Membership",
    "member": "https://example.edu/users/554433",
    "organization": "https://example.edu/terms/201801/courses/7/sections/1",
    "roles": [ "Learner" ],
    "status": "Active",
    "dateCreated": "2018-08-01T06:00:00.000Z"
  },
  "session": {
    "id": "https://example.edu/sessions/1f6442a482de72ea6ad134943812bff564a76259",
    "type": "Session",
    "startedAtTime": "2018-11-15T10:00:00.000Z"
  }
}
*/