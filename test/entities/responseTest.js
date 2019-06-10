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

var config =  require('../../src/config/config');
var entityFactory = require('../../src/entities/entityFactory');
var Assessment = require('../../src/entities/resource/assessment');
var AssessmentItem = require('../../src/entities/resource/assessmentItem');
var Attempt = require('../../src/entities/outcome/attempt');
var Response = require('../../src/entities/response/response');

var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + "caliperEntityResponseExtended.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('responseTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    var BASE_EDU_IRI = 'https://example.edu';

    var sampleAssessment = entityFactory().create(Assessment, {
      id: BASE_EDU_IRI.concat('/terms/201601/courses/7/sections/1/assess/1')
    });

    var sampleAssessmentItem = entityFactory().create(AssessmentItem, {
      id: BASE_EDU_IRI.concat('/terms/201601/courses/7/sections/1/assess/1/items/6'),
      isPartOf: sampleAssessment,
      dateCreated: '2016-08-01T06:00:00.000Z',
      datePublished: '2016-08-15T09:30:00.000Z',
      isTimeDependent: false,
      maxAttempts: 2,
      maxScore: 5.0,
      maxSubmits: 2,
      extensions: {
        questionType: 'Short Answer',
        questionText: 'Define a Caliper Event and provide examples.'
      }
    });

    var sampleAttempt = entityFactory().create(Attempt, {
      id: BASE_EDU_IRI.concat('/terms/201601/courses/7/sections/1/assess/1/items/6/users/554433/attempts/1'),
      assignee: 'https://example.edu/users/554433',
      assignable: sampleAssessmentItem,
      count: 1,
      startedAtTime: '2016-11-15T10:15:46.000Z',
      endedAtTime: '2016-11-15T10:17:20.000Z'
    });

    var entity = entityFactory().create(Response, {
      id: BASE_EDU_IRI.concat('/terms/201601/courses/7/sections/1/assess/1/items/6/users/554433/responses/1'),
      attempt: sampleAttempt,
      dateCreated: '2016-11-15T10:15:46.000Z',
      startedAtTime: '2016-11-15T10:15:46.000Z',
      endedAtTime: '2016-11-15T10:17:20.000Z',
      extensions: {
        value: 'A Caliper Event describes a relationship established between an actor and an object.  The relationship is formed as a result of a purposeful action undertaken by the actor in connection to the object at a particular moment. A learner starting an assessment, annotating a reading, pausing a video, or posting a message to a forum, are examples of learning activities that Caliper models as events.'
      }
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(entity));
    var diffMsg = 'Validate JSON' + (!_.isUndefined(diff) ? ' diff = ' + clientUtils.stringify(diff) : '');

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});