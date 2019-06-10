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
var entityFactory = require('../../src/entities/entityFactory');
var MultiselectQuestion = require('../../src/entities/question/multiselectQuestion');

var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + 'caliperEntityMultiselectQuestion.json';

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('multiselectQuestionTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    var BASE_EDU_IRI = 'https://example.edu';

    var entity = entityFactory().create(MultiselectQuestion, {
        id: BASE_EDU_IRI.concat('/surveys/100/questionnaires/30/items/4/question'),
        questionPosed: 'What do you want to study today?',
        points: 4,
        itemLabels: ['Calculus', 'Number theory', 'Combinatorics', 'Algebra'],
        itemValues: [
            'https://example.edu/terms/201801/courses/7/sections/1/objectives/1',
            'https://example.edu/terms/201801/courses/7/sections/1/objectives/2',
            'https://example.edu/terms/201801/courses/7/sections/1/objectives/3',
            'https://example.edu/terms/201801/courses/7/sections/1/objectives/4'
        ]
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(entity));
    var diffMsg = 'Validate JSON' + (!_.isUndefined(diff) ? ' diff = ' + clientUtils.stringify(diff) : '');

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});
