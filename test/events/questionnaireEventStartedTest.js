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
var QuestionnaireEvent = require('../../src/events/questionnaireEvent');
var actions = require('../../src/actions/actions');

var entityFactory = require('../../src/entities/entityFactory');
var CourseSection = require('../../src/entities/agent/courseSection');
var Membership = require('../../src/entities/agent/membership');
var Person = require('../../src/entities/agent/person');
var Questionnaire = require('../../src/entities/resource/questionnaire');
var QuestionnaireItem = require('../../src/entities/resource/questionnaireItem');
var Role = require('../../src/entities/agent/role');
var Session = require('../../src/entities/session/session');
var Status = require('../../src/entities/agent/status');

var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + 'caliperEventQuestionnaireStarted.json';

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('questionnaireEventStartedTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    var BASE_EDU_IRI = 'https://example.edu';

    // Person (actor)
    var samplePerson = entityFactory().create(Person, {id: BASE_EDU_IRI.concat('/users/554433')});

    // Questionnaire and QuestionnaireItems (object)
    var questionnaireItemOne = entityFactory().create(QuestionnaireItem, {
        id: BASE_EDU_IRI.concat('/surveys/100/questionnaires/30/items/1')
    });
    var questionnaireItemTwo = entityFactory().create(QuestionnaireItem, {
        id: BASE_EDU_IRI.concat('/surveys/100/questionnaires/30/items/2')
    });

    var sampleQuestionnaire = entityFactory().create(Questionnaire, {
        id: BASE_EDU_IRI.concat('/surveys/100/questionnaires/30'),
        items: [questionnaireItemOne, questionnaireItemTwo],
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
    var event = eventFactory().create(QuestionnaireEvent, {
      id: 'urn:uuid:23995ed4-3c6b-11e9-b210-d663bd873d93',
      actor: samplePerson,
      action: actions.started.term,
      object: sampleQuestionnaire,
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