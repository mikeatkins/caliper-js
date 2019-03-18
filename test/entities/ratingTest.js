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
var Comment = require('../../src/entities/survey/comment');
var Person = require('../../src/entities/agent/person');
var CourseSection = require('../../src/entities/agent/courseSection');
var DigitalResource = require('../../src/entities/resource/digitalResource');
var DigitalResourceCollection = require('../../src/entities/resource/digitalResourceCollection');
var LikertScale = require('../../src/entities/survey/likertScale');
var Rating = require('../../src/entities/survey/rating');
var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + "caliperEntityRating.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;
  
  test('ratingTest', function (t) {
    
    // Plan for N assertions
    t.plan(1);
    
    var BASE_IRI = "https://example.edu";
    var BASE_SECTION_IRI = "https://example.edu/terms/201801/courses/7/sections/1";
    
    var person = entityFactory().create(Person, {id: BASE_IRI.concat("/users/554433")});
    var section = entityFactory().create(CourseSection, {id: BASE_SECTION_IRI});
    var collection = entityFactory().create(DigitalResourceCollection, {
      id: BASE_SECTION_IRI.concat("/resources/1"),
      name: "Course Assets",
      isPartOf: section
    });
    var resource = entityFactory().create(DigitalResource, {
      id: BASE_SECTION_IRI.concat("/resources/1/syllabus.pdf"),
      name: "Course Syllabus",
      mediaType: "application/pdf",
      isPartOf: collection,
      dateCreated: moment.utc("2018-08-02T11:32:00.000Z")
    });
  
    var labels = [];
    labels.push("Strongly Disagree");
    labels.push("Disagree");
    labels.push("Agree");
    labels.push("Strongly Agree");
  
    var values = [];
    values.push(-2);
    values.push(-1);
    values.push(1);
    values.push(2);
  
    var likertScale = entityFactory().create(LikertScale, {
      id: "https://example.edu/scale/2",
      scalePoints: 4,
      question: "Do you agree with the opinion presented?",
      itemLabels: labels,
      itemValues: values
    });
  
    var comment = entityFactory().create(Comment, {
      id: BASE_SECTION_IRI.concat("/assess/1/items/6/users/665544/responses/1/comment/1"),
      commenter: person,
      commentedOn: resource,
      value: "I like what you did here but you need to improve on...",
      dateCreated: moment.utc("2018-08-01T06:00:00.000Z")
    });
    
    
    var entity = entityFactory().create(Rating, {
      id: BASE_IRI.concat("/users/554433/rating/1"),
      rater: person,
      rated: resource,
      scale: likertScale,
      selections: ["1"],
      ratingComment: comment,
      dateCreated: moment.utc("2018-08-01T06:00:00.000Z")
    });
    
    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(entity));
    var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");
    
    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});

/**
{
  "@context": "http://purl.imsglobal.org/ctx/caliper/v1p1/FeedbackProfile-extension",
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
  "scale": {
  "id": "https://example.edu/scale/2",
    "type": "LikertScale",
    "points": 4,
    "question": "Do you agree with the opinion presented?",
    "itemLabels": ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"],
    "itemValues": [-2, -1, 1, 2]
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
}
*/