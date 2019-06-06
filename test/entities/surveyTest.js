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
var Survey = require('../../src/entities/survey/survey');
var Questionnaire = require('../../src/entities/resource/questionnaire');
var QuestionnaireItem = require('../../src/entities/resource/questionnaireItem');

var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + "caliperEntitySurvey.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('surveyTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    var BASE_EDU_IRI = "https://example.edu";
    var BASE_COM_IRI = "https://example.com";
    var QUESTIONNAIRE_TIMESTAMP = "2018-08-01T06:00:00.000Z";

    var  questionnaires = [];
    questionnaires.push(entityFactory().create(Questionnaire, {id: BASE_EDU_IRI.concat("/surveys/100/questionnaires/30"), dateCreated: QUESTIONNAIRE_TIMESTAMP}));
    questionnaires.push(entityFactory().create(Questionnaire, {id: BASE_COM_IRI.concat("/surveys/100/questionnaires/31"), dateCreated: QUESTIONNAIRE_TIMESTAMP}));

    questionnaires[0].items.push(entityFactory().create(QuestionnaireItem, {id: BASE_EDU_IRI.concat("/surveys/100/questionnaires/30/items/1")}))
    questionnaires[0].items.push(entityFactory().create(QuestionnaireItem, {id: BASE_EDU_IRI.concat("/surveys/100/questionnaires/30/items/2")}))
    questionnaires[1].items.push(entityFactory().create(QuestionnaireItem, {id: BASE_EDU_IRI.concat("/surveys/100/questionnaires/31/items/1")}))
    questionnaires[1].items.push(entityFactory().create(QuestionnaireItem, {id: BASE_EDU_IRI.concat("/surveys/100/questionnaires/31/items/2")}))

    var entity = entityFactory().create(Survey, {
      id: BASE_EDU_IRI.concat("/collections/1"),
      items: questionnaires
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(entity));
    var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});



//{
//  "@context": "http://purl.imsglobal.org/ctx/caliper/v1p1/SurveyProfile-extension",
//  "id": "https://example.edu/collections/1",
//  "type": "Survey",
//  "items": [
//    {
//      "id": "https://example.edu/surveys/100/questionnaires/30",
//      "type": "Questionnaire",
//      "items": [
//        {
//          "id": "https://example.edu/surveys/100/questionnaires/30/items/1",
//          "type": "QuestionnaireItem"
//        },
//        {
//          "id": "https://example.edu/surveys/100/questionnaires/30/items/2",
//          "type": "QuestionnaireItem"
//        }
//      ],
//      "dateCreated": "2018-08-01T06:00:00.000Z"
//    },
//    {
//      "id": "https://example.edu/surveys/100/questionnaires/31",
//      "type": "Questionnaire",
//      "items": [
//        {
//          "id": "https://example.edu/surveys/100/questionnaires/31/items/1",
//          "type": "QuestionnaireItem"
//        },
//        {
//          "id": "https://example.edu/surveys/100/questionnaires/31/items/2",
//          "type": "QuestionnaireItem"
//        }
//      ],
//      "dateCreated": "2018-08-01T06:00:00.000Z"
//    }
//  ]
//}
