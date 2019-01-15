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
var ToolLaunchEvent = require('../../src/events/toolLaunchEvent');
var actions = require('../../src/actions/actions');

var entityFactory = require('../../src/entities/entityFactory');
var CourseSection = require('../../src/entities/agent/courseSection');
var LtiLink = require('../../src/entities/resource/ltiLink');
var LtiSession = require('../../src/entities/session/ltiSession');
var Membership = require('../../src/entities/agent/membership');
var Person = require('../../src/entities/agent/person');
var Role = require('../../src/entities/agent/role');
var Session = require('../../src/entities/session/session');
var SoftwareApplication = require('../../src/entities/agent/softwareApplication');
var WebPage = require('../../src/entities/resource/webPage');

var Status = require('../../src/entities/agent/status');
var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + "caliperEventToolLaunchLaunched.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;
  
  test('toolLaunchEventLaunchedTest', function (t) {
    
    // Plan for N assertions
    t.plan(1);
    
    var BASE_EDU_IRI = "https://example.edu";
    var BASE_COM_IRI = "https://example.com";
    var BASE_SECTION_IRI = "https://example.edu/terms/201801/courses/7/sections/1";
    
    // Id with canned value
    uuid = "urn:uuid:a2e8b214-4d4a-4456-bb4c-099945749117";
    
    // The Actor
    var actor = entityFactory().create(Person, {id: BASE_EDU_IRI.concat("/users/554433")});
    
    // The Action
    var action = actions.launched.term;
    
    // The Object of the interaction
    var obj = entityFactory().create(SoftwareApplication, {id: BASE_COM_IRI.concat("/lti/tool")});
    
    // Event time
    var eventTime = moment.utc("2018-11-15T10:15:00.000Z");
    
    // edApp
    var edApp = entityFactory().create(SoftwareApplication, {id: BASE_EDU_IRI});
    
    // Referrer
    var referrer = entityFactory().create(WebPage, {id: BASE_SECTION_IRI.concat("/pages/1")});

    // Target
    var target = entityFactory().create(LtiLink, {
      id: "https://tool.com/link/123",
      messageType: "LtiResourceLinkRequest"
    });
    
    // Group
    var group = entityFactory().create(CourseSection, {
      id: BASE_SECTION_IRI,
      courseNumber: "CPS 435-01",
      academicSession: "Fall 2018"
    });
    
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
      id: BASE_EDU_IRI.concat("/sessions/1f6442a482de72ea6ad134943812bff564a76259"),
      startedAtTime: moment.utc("2018-11-15T10:00:00.000Z")
    });
    
    // LTI-related message parameters
    var messageParameters = {
      "iss": "https://example.edu",
      "sub": "https://example.edu/users/554433",
      "aud": ["https://example.com/lti/tool"],
      "exp": 1510185728,
      "iat": 1510185228,
      "azp": "962fa4d8-bcbf-49a0-94b2-2de05ad274af",
      "nonce": "fc5fdc6d-5dd6-47f4-b2c9-5d1216e9b771",
      "name": "Ms Jane Marie Doe",
      "given_name": "Jane",
      "family_name": "Doe",
      "middle_name": "Marie",
      "picture": "https://example.edu/jane.jpg",
      "email": "jane@example.edu",
      "locale": "en-US",
      "https://purl.imsglobal.org/spec/lti/claim/deployment_id": "07940580-b309-415e-a37c-914d387c1150",
      "https://purl.imsglobal.org/spec/lti/claim/message_type": "LtiResourceLinkRequest",
      "https://purl.imsglobal.org/spec/lti/claim/version": "1.3.0",
      "https://purl.imsglobal.org/spec/lti/claim/roles": [
        "http://purl.imsglobal.org/vocab/lis/v2/institution/person#Student",
        "http://purl.imsglobal.org/vocab/lis/v2/membership#Learner",
        "http://purl.imsglobal.org/vocab/lis/v2/membership#Mentor"
      ],
      "https://purl.imsglobal.org/spec/lti/claim/role_scope_mentor": [
        "http://purl.imsglobal.org/vocab/lis/v2/institution/person#Administrator"
      ],
      "https://purl.imsglobal.org/spec/lti/claim/context": {
        "id": "https://example.edu/terms/201801/courses/7/sections/1",
        "label": "CPS 435-01",
        "title": "CPS 435 Learning Analytics, Section 01",
        "type": ["http://purl.imsglobal.org/vocab/lis/v2/course#CourseSection"
        ]
      },
      "https://purl.imsglobal.org/spec/lti/claim/resource_link": {
        "id": "200d101f-2c14-434a-a0f3-57c2a42369fd",
        "description": "Assignment to introduce who you are",
        "title": "Introduction Assignment"
      },
      "https://purl.imsglobal.org/spec/lti/claim/tool_platform": {
        "guid": "https://example.edu",
        "contact_email": "support@example.edu",
        "description": "An Example Tool Platform",
        "name": "Example Tool Platform",
        "url": "https://example.edu",
        "product_family_code": "ExamplePlatformVendor-Product",
        "version": "1.0"
      },
      "https://purl.imsglobal.org/spec/lti/claim/launch_presentation": {
        "document_target": "iframe",
        "height": 320,
        "width": 240,
        "return_url": "https://example.edu/terms/201801/courses/7/sections/1/pages/1"
      },
      "https://purl.imsglobal.org/spec/lti/claim/custom": {
        "xstart": "2017-04-21T01:00:00Z",
        "request_url": "https://tool.com/link/123"
      },
      "https://purl.imsglobal.org/spec/lti/claim/lis": {
        "person_sourcedid": "example.edu:71ee7e42-f6d2-414a-80db-b69ac2defd4",
        "course_offering_sourcedid": "example.edu:SI182-F16",
        "course_section_sourcedid": "example.edu:SI182-001-F16"
      },
      "http://www.ExamplePlatformVendor.com/session": {
        "id": "89023sj890dju080"
      }
    };
    
    // Federated Session
    var federatedSession = entityFactory().create(LtiSession, {
      id: "https://example.edu/lti/sessions/b533eb02823f31024e6b7f53436c42fb99b31241",
      user: actor,
      messageParameters: messageParameters,
      dateCreated: moment.utc("2018-11-15T10:15:00.000Z"),
      startedAtTime: moment.utc("2018-11-15T10:15:00.000Z")
    });
    
    // Assert that key attributes are the same
    var event = eventFactory().create(ToolLaunchEvent, {
      '@context': "http://purl.imsglobal.org/ctx/caliper/v1p1/ToolLaunchProfile-extension",
      id: uuid,
      actor: actor,
      action: action,
      object: obj,
      eventTime: eventTime,
      edApp: edApp,
      referrer: referrer,
      target: target,
      group: group,
      membership: membership,
      session: session,
      federatedSession: federatedSession
    });
    
    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(event));
    var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");
    
    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});

/*

{
  "@context": "http://purl.imsglobal.org/ctx/caliper/v1p1/ToolLaunchProfile-extension",
    "id": "urn:uuid:a2e8b214-4d4a-4456-bb4c-099945749117",
    "type": "ToolLaunchEvent",
    "actor": {
  "id": "https://example.edu/users/554433",
      "type": "Person"
},
  "action": "Launched",
    "object": {
  "id": "https://example.com/lti/tool",
      "type": "SoftwareApplication"
},
  "eventTime": "2018-11-15T10:15:00.000Z",
    "edApp": {
  "id": "https://example.edu",
      "type": "SoftwareApplication"
},
  "referrer": {
  "id": "https://example.edu/terms/201801/courses/7/sections/1/pages/1",
      "type": "WebPage"
},
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
},
  "target": {
  "id": "https://tool.com/link/123",
      "type": "LtiLink",
      "messageType": "LtiResourceLinkRequest"
},
  "federatedSession": {
  "id": "https://example.edu/lti/sessions/b533eb02823f31024e6b7f53436c42fb99b31241",
      "type": "LtiSession",
      "user": {
    "id": "https://example.edu/users/554433",
        "type": "Person"
  },
  "dateCreated": "2018-11-15T10:15:00.000Z",
      "startedAtTime": "2018-11-15T10:15:00.000Z",
      "messageParameters": {
    "iss": "https://example.edu",
        "sub": "https://example.edu/users/554433",
        "aud": ["https://example.com/lti/tool"],
        "exp": 1510185728,
        "iat": 1510185228,
        "azp": "962fa4d8-bcbf-49a0-94b2-2de05ad274af",
        "nonce": "fc5fdc6d-5dd6-47f4-b2c9-5d1216e9b771",
        "name": "Ms Jane Marie Doe",
        "given_name": "Jane",
        "family_name": "Doe",
        "middle_name": "Marie",
        "picture": "https://example.edu/jane.jpg",
        "email": "jane@example.edu",
        "locale": "en-US",
        "https://purl.imsglobal.org/spec/lti/claim/deployment_id": "07940580-b309-415e-a37c-914d387c1150",
        "https://purl.imsglobal.org/spec/lti/claim/message_type": "LtiResourceLinkRequest",
        "https://purl.imsglobal.org/spec/lti/claim/version": "1.3.0",
        "https://purl.imsglobal.org/spec/lti/claim/roles": [
      "http://purl.imsglobal.org/vocab/lis/v2/institution/person#Student",
      "http://purl.imsglobal.org/vocab/lis/v2/membership#Learner",
      "http://purl.imsglobal.org/vocab/lis/v2/membership#Mentor"
    ],
        "https://purl.imsglobal.org/spec/lti/claim/role_scope_mentor": [
      "http://purl.imsglobal.org/vocab/lis/v2/institution/person#Administrator"
    ],
        "https://purl.imsglobal.org/spec/lti/claim/context": {
      "id": "https://example.edu/terms/201801/courses/7/sections/1",
          "label": "CPS 435-01",
          "title": "CPS 435 Learning Analytics, Section 01",
          "type": ["http://purl.imsglobal.org/vocab/lis/v2/course#CourseSection"]
    },
    "https://purl.imsglobal.org/spec/lti/claim/resource_link": {
      "id": "200d101f-2c14-434a-a0f3-57c2a42369fd",
          "description": "Assignment to introduce who you are",
          "title": "Introduction Assignment"
    },
    "https://purl.imsglobal.org/spec/lti/claim/tool_platform": {
      "guid": "https://example.edu",
          "contact_email": "support@example.edu",
          "description": "An Example Tool Platform",
          "name": "Example Tool Platform",
          "url": "https://example.edu",
          "product_family_code": "ExamplePlatformVendor-Product",
          "version": "1.0"
    },
    "https://purl.imsglobal.org/spec/lti/claim/launch_presentation": {
      "document_target": "iframe",
          "height": 320,
          "width": 240,
          "return_url": "https://example.edu/terms/201801/courses/7/sections/1/pages/1"
    },
    "https://purl.imsglobal.org/spec/lti/claim/custom": {
      "xstart": "2017-04-21T01:00:00Z",
          "request_url": "https://tool.com/link/123"
    },
    "https://purl.imsglobal.org/spec/lti/claim/lis": {
      "person_sourcedid": "example.edu:71ee7e42-f6d2-414a-80db-b69ac2defd4",
          "course_offering_sourcedid": "example.edu:SI182-F16",
          "course_section_sourcedid": "example.edu:SI182-001-F16"
    },
    "http://www.ExamplePlatformVendor.com/session": {
      "id": "89023sj890dju080"
    }
  }
}
}

*/