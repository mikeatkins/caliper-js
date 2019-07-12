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
var QuestionnaireItemEvent = require('../../src/events/questionnaireItemEvent');
var actions = require('../../src/actions/actions');

var entityFactory = require('../../src/entities/entityFactory');
var CourseSection = require('../../src/entities/agent/courseSection');
var LikertScale = require('../../src/entities/scale/likertScale');
var Membership = require('../../src/entities/agent/membership');
var Person = require('../../src/entities/agent/person');
var RatingScaleQuestion = require('../../src/entities/question/ratingScaleQuestion');
var RatingScaleResponse = require('../../src/entities/response/ratingScaleResponse');
var QuestionnaireItem = require('../../src/entities/resource/questionnaireItem');
var Role = require('../../src/entities/agent/role');
var Session = require('../../src/entities/session/session');
var Status = require('../../src/entities/agent/status');

var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + 'caliperEventQuestionnaireItemCompletedRatingScaleQuestion.json';

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('questionnaireItemEventCompletedRatingScaleQuestionTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    var BASE_EDU_IRI = 'https://example.edu';

    // Person (actor)
    var samplePerson = entityFactory().create(Person, {id: BASE_EDU_IRI.concat('/users/554433')});

    // QuestionnaireItem, RatingScaleQuestion, and LikertScale (object)
    var sampleLikertScale = entityFactory().create(LikertScale, {
        id: BASE_EDU_IRI.concat('/scale/2'),
        scalePoints: 4,
        itemLabels: ['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree'],
        itemValues: ['-2', '-1', '1', '2']
    });

    var sampleRatingScaleQuestion = entityFactory().create(RatingScaleQuestion, {
        id: BASE_EDU_IRI.concat('/surveys/100/questionnaires/30/items/1/question'),
        questionPosed: 'How satisfied are you with our services?',
        scale: sampleLikertScale,
    });

    var sampleQuestionnaireItem = entityFactory().create(QuestionnaireItem, {
        id: BASE_EDU_IRI.concat('/surveys/100/questionnaires/30/items/1'),
        question: sampleRatingScaleQuestion,
        categories: ['teaching effectiveness', 'Course structure'],
        weight: 1.0
    });

    // RatingScaleResponse (generated)

    var sampleRatingScaleResponse = entityFactory().create(RatingScaleResponse, {
      id: BASE_EDU_IRI.concat('/surveys/100/questionnaires/30/items/1/users/554433/responses/1'),
      selections: ['Satisfied'],
      startedAtTime: '2018-08-01T05:55:48.000Z',
      endedAtTime: '2018-08-01T06:00:00.000Z',
      duration: 'PT4M12S',
      dateCreated: '2018-08-01T06:00:00.000Z'
    });

    // CourseSection (group)
    var sampleCourseSection = entityFactory().create(CourseSection, {
      id: BASE_EDU_IRI.concat('/terms/201801/courses/7/sections/1'),
      courseNumber: 'CPS 435-01',
      academicSession: 'Fall 2018'
    });

    // Membership
    var sampleMembership = entityFactory().create(Membership, {
      id: sampleCourseSection.id.concat('/rosters/1'),
      member: samplePerson.id,
      organization: sampleCourseSection.id,
      roles: [Role.learner.term],
      status: Status.active.term,
      dateCreated: '2018-08-01T06:00:00.000Z'
    });

    // Session
    var sampleSession = entityFactory().create(Session, {
      id: BASE_EDU_IRI.concat('/sessions/f095bbd391ea4a5dd639724a40b606e98a631823'),
      startedAtTime: '2018-11-12T10:00:00.000Z'
    });

    // Event
    var event = eventFactory().create(QuestionnaireItemEvent, {
      id: 'urn:uuid:590f1ff2-3c6d-11e9-b210-d663bd873d93',
      actor: samplePerson,
      action: actions.completed.term,
      object: sampleQuestionnaireItem,
      generated: sampleRatingScaleResponse,
      eventTime: '2018-11-12T10:15:00.000Z',
      edApp: BASE_EDU_IRI,
      group: sampleCourseSection,
      membership: sampleMembership,
      session: sampleSession
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(event));
    var diffMsg = 'Validate JSON' + (!_.isUndefined(diff) ? ' diff = ' + clientUtils.stringify(diff) : '');

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});