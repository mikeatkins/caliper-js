/**
 *  @copyright ©2013 IMS Global Learning Consortium, Inc.  All Rights Reserved.
 *  @license For license information contact, info@imsglobal.org
 */

var test = require('tape');
var _ = require('lodash-node');
var util = require('util');
var jsonCompare = require('./testUtils');

var Event = require('../src/events/sessionEvent');

// Actor
var Person = require('../src/entities/agent/person');

// Action
var SessionActions = require('../src/actions/sessionActions');

// Activity Context
var EPubVolume = require('../src/entities/reading/ePubVolume');
var Frame = require('../src/entities/reading/frame');
var Session = require('../src/entities/session/session');

// Learning Context
var CourseOffering = require('../src/entities/lis/courseOffering');
var CourseSection = require('../src/entities/lis/courseSection');
var Group = require('../src/entities/lis/group');
var Membership = require('../src/entities/lis/membership');
var Role = require('../src/entities/lis/role');
var SoftwareApplication = require('../src/entities/agent/softwareApplication');
var Status = require('../src/entities/lis/status');

test('Create Session TIMEOUT Event and validate attributes', function(t) {

    // Plan for N assertions
    t.plan(1);

    // The actor
    var actor = new SoftwareApplication("https://github.com/readium/readium-js-viewer");
    actor.setName("Readium");
    actor.setHasMembership([]);
    actor.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    actor.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // The Action for the Caliper Event
    var action = SessionActions.TIMED_OUT;

    // The Object being interacted with by the Actor
    var eventObj = actor;

    //var ePubVolume = new EPubVolume("https://github.com/readium/readium-js-viewer/book/34843#epubcfi(/4/3)");
    //ePubVolume.setName("The Glorious Cause: The American Revolution, 1763-1789 (Oxford History of the United States)");
    //ePubVolume.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    //ePubVolume.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // The session actor
    var sessionActor = new Person("https://some-university.edu/user/554433");
    var membership1 = new Membership("https://some-university.edu/membership/001");
    membership1.setMember("https://some-university.edu/user/554433");
    membership1.setOrganization("https://some-university.edu/politicalScience/2015/american-revolution-101");
    membership1.setRoles([Role.LEARNER]);
    membership1.setStatus(Status.ACTIVE);
    membership1.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    membership1.setDateModified(null);
    var membership2 = new Membership("https://some-university.edu/membership/002");
    membership2.setMember("https://some-university.edu/user/554433");
    membership2.setOrganization("https://some-university.edu/politicalScience/2015/american-revolution-101/section/001");
    membership2.setRoles([Role.LEARNER]);
    membership2.setStatus(Status.ACTIVE);
    membership2.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    membership2.setDateModified(null);
    var membership3 = new Membership("https://some-university.edu/membership/003");
    membership3.setMember("https://some-university.edu/user/554433");
    membership3.setOrganization("https://some-university.edu/politicalScience/2015/american-revolution-101/section/001/group/001");
    membership3.setRoles([Role.LEARNER]);
    membership3.setStatus(Status.ACTIVE);
    membership3.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    membership3.setDateModified(null);
    sessionActor.setHasMembership([membership1, membership2, membership3]);
    sessionActor.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    sessionActor.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // The target session
    var target = new Session("https://github.com/readium/session-123456789");
    target.setName("session-123456789");
    target.setDescription(null);
    target.setActor(sessionActor);
    target.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    target.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());
    target.setStartedAtTime((new Date("2015-09-15T10:15:00Z")).toISOString());
    target.setEndedAtTime((new Date("2015-09-15T11:05:00Z")).toISOString());
    target.setDuration("PT3000S");

    var generated = null;

    // The edApp that is part of the Learning Context
    var edApp = actor;

    // LIS Course Offering
    var courseOffering = new CourseOffering("https://some-university.edu/politicalScience/2015/american-revolution-101");
    courseOffering.setName("Political Science 101: The American Revolution");
    courseOffering.setCourseNumber("POL101");
    courseOffering.setAcademicSession("Fall-2015");
    courseOffering.setMembership([]);
    courseOffering.setSubOrganizationOf(null);
    courseOffering.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    courseOffering.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // LIS Course Section
    var courseSection = new CourseSection("https://some-university.edu/politicalScience/2015/american-revolution-101/section/001");
    courseSection.setName("American Revolution 101");
    courseSection.setCourseNumber("POL101");
    courseSection.setCategory(null);
    courseSection.setAcademicSession("Fall-2015");
    courseSection.setMembership([membership2]);
    courseSection.setSubOrganizationOf(courseOffering);
    courseSection.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    courseSection.setDateModified((new Date("2015-09-02T11:30:00Z")).toISOString());

    // LIS Group
    var group = new Group("https://some-university.edu/politicalScience/2015/american-revolution-101/section/001/group/001");
    group.setName("Discussion Group 001");
    group.setMembership([membership3]);
    group.setSubOrganizationOf(courseSection);
    group.setDateCreated((new Date("2015-08-01T06:00:00Z")).toISOString());
    group.setDateModified(null);

    // Assert that key attributes are the same
    var sessionEvent = new Event();
    sessionEvent.setActor(actor);
    sessionEvent.setAction(action);
    sessionEvent.setObject(eventObj);
    sessionEvent.setTarget(target);
    sessionEvent.setGenerated(generated);
    sessionEvent.setEdApp(edApp);
    sessionEvent.setGroup(group);
    sessionEvent.setStartedAtTime((new Date("2015-09-15T10:15:00Z")).toISOString());
    sessionEvent.setEndedAtTime((new Date("2015-09-15T11:05:00Z")).toISOString());
    sessionEvent.setDuration("PT3000S");

    console.log("Session Event = " + util.inspect(sessionEvent));

    // Assert that JSON produced is the same
    jsonCompare('caliperSessionTimeoutEvent', sessionEvent, t);
})