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
var Document = require('../../src/entities/resource/document');
var Person = require('../../src/entities/agent/person');
var Query =  require('../../src/entities/search/query');
var SearchResponse =  require('../../src/entities/search/searchResponse');
var SoftwareApplication = require('../../src/entities/agent/softwareApplication');
var VideoObject = require('../../src/entities/resource/videoObject');
var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + "caliperEntitySearchResponse.json";

testUtils.readFile(path, function(err, fixture) {
    if (err) throw err;

    test('searchResponseTest', function (t) {

        // Plan for N assertions
        t.plan(1);

        var BASE_IRI = "https://example.edu";

        var actor = entityFactory().create(Person, {id: BASE_IRI.concat("/users/554433")});

        // Query submitted
        var query = entityFactory().create(Query, {
            id: "https://example.edu/users/554433/search?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29",
            creator: actor,
            searchTarget: "https://example.edu/catalog",
            searchTerms: "IMS AND (Caliper OR Analytics)",
            dateCreated: moment.utc("2018-11-15T10:05:00.000Z")

        });

        var pdf = entityFactory().create(Document, {
            id: BASE_IRI.concat("/catalog/record/01234?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29"),
            mediaType: "application/pdf"
        });

        var video = entityFactory().create(VideoObject, {
            id: BASE_IRI.concat("/catalog/record/09876?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29"),
            mediaType: "video/ogg"
        });

        var epub = entityFactory().create(Document, {
            id: BASE_IRI.concat("/catalog/record/05432?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29"),
            mediaType: "application/epub+zip"
        });

        var provider = entityFactory().create(SoftwareApplication, {id: BASE_IRI});

        var target = entityFactory().create(SoftwareApplication, {id: BASE_IRI.concat("/catalog")});

        // SearchResponse
        var entity = entityFactory().create(SearchResponse, {
            id: "https://example.edu/users/554433/response?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29",
            searchProvider: provider,
            searchTarget: target,
            query: query,
            searchResultsItemCount: 3,
            searchResults: [ pdf, video, epub ],
            dateCreated: moment.utc("2018-11-15T10:05:00.000Z")
        });

        // Compare
        var diff = testUtils.compare(fixture, clientUtils.parse(entity));
        var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");

        t.equal(true, _.isUndefined(diff), diffMsg);
        //t.end();
    });
});

/*
{
  "@context": "http://purl.imsglobal.org/ctx/caliper/v1p1/SearchProfile-extension",
  "id": "https://example.edu/users/554433/response?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29",
  "type": "SearchResponse",
  "searchProvider": {
    "id": "https://example.edu",
    "type": "SoftwareApplication"
  },
  "searchTarget": {
    "id": "https://example.edu/catalog",
    "type": "SoftwareApplication"
  },
  "query": {
    "id": "https://example.edu/users/554433/search?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29",
    "type": "Query",
    "creator": {
      "id": "https://example.edu/users/554433",
      "type": "Person"
    },
    "searchTarget": "https://example.edu/catalog",
    "searchTerms": "IMS AND (Caliper OR Analytics)",
    "dateCreated": "2018-11-15T10:05:00.000Z"
  },
  "searchResultsItemCount": 3,
  "searchResults": [{
    "id": "https://example.edu/catalog/record/01234?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29",
    "type": "Document",
    "mediaType": "application/pdf"
  },
    {
      "id": "https://example.edu/catalog/record/09876?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29",
      "type": "VideoObject",
      "mediaType": "video/ogg"
    },
    {
      "id": "https://example.edu/catalog/record/05432?query=IMS%20AND%20%28Caliper%20OR%20Analytics%29",
      "type": "Document",
      "mediaType": "application/epub+zip"
    }
  ],
  "dateCreated": "2018-11-15T10:05:00.000Z"
}
 */