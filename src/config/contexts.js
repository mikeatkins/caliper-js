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

var contexts =  [
    {
        version: "v1p0",
        iri: "http://purl.imsglobal.org/ctx/caliper/v1/Context",
        precedence: 10
    },
    {
        version: "v1p1",
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1",
        precedence: 11
    },
    {
        version: "v1p1/FeedbackProfile-extension",
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1/FeedbackProfile-extension",
        precedence: 11.5
    },
    {
        version: "v1p1/ResourceManagementProfile-extension",
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1/ResourceManagementProfile-extension",
        precedence: 11.5
    },
    {
        version: "v1p1/SearchProfile-extension",
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1/SearchProfile-extension",
        precedence: 11.5
    },
    {
        version: "v1p1/ToolUseProfile-extension",
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1/ToolUseProfile-extension",
        precedence: 11.5
    },
    {
        version: "v1p1/ToolLaunchProfile-extension",
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1/ToolLaunchProfile-extension",
        precedence: 11.5
    },
    {
        version: "v1p2",
        iri: "https://purl.imsglobal.org/ctx/caliper/v1p2",
        precedence: 12
    }
];

/**
var context =  {
    v1p0: {
        iri: "http://purl.imsglobal.org/ctx/caliper/v1/Context",
        precedence: 10
    },
    v1p1: {
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1",
        precedence: 11
    },
    v1p1_feedback: {
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1/FeedbackProfile-extension",
        precedence: 11.5
    },
    v1p1_resourceManagement: {
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1/ResourceManagementProfile-extension",
        precedence: 11.5
    },
    v1p1_search: {
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1/SearchProfile-extension",
        precedence: 11.5
    },
    v1p1_toolUse: {
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1/ToolUseProfile-extension",
        precedence: 11.5
    },
    v1p1_toolLaunch: {
        iri: "http://purl.imsglobal.org/ctx/caliper/v1p1/ToolLaunchProfile-extension",
        precedence: 11.5
    },
    v1p2: {
        iri: "https://purl.imsglobal.org/ctx/caliper/v1p2",
        precedence: 12
    }
};
 */

module.exports = contexts;