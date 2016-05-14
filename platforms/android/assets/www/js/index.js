/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},
	// Update DOM on a Received Event
	receivedEvent: function(id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');

		console.log('Received Event: ' + id);
	}
};

// Global variable that will tell us whether PhoneGap is ready
var isPhoneGapReady = false;

// Store the current network status
var isConnected = false;
var internetInterval;
var currentUrl;

function init(url){
	if(typeof url != 'string'){
		currentUrl = location.href;
	} else {
		currentUrl = url;
	}

	if( ! isPhoneGapReady ){
		onDeviceReady();
	} else {
		// Add an event listener for deviceready
		document.addEventListener("deviceready", onDeviceReady, false);
	}
}

function onDeviceReady(){
	// set to true
	isPhoneGapReady = true;

	// detect for network access
	networkDetection();

	executeEvents();

	executeCallback();
}

function executeEvents(){
	if(isPhoneGapReady){
		// attach events for online and offline detection
		document.addEventListener("online", onOnline, false);
		document.addEventListener("offline", onOffline, false);

		// set a timer to check the network status
		internetInterval = window.setInterval(function() {
			if(navigator.network.connection.type != Connection.NONE){
				onOnline();
			} else {
				onOffline();
			}
		}, 5000);
	}
}

function executeCallback(){
	if(isPhoneGapReady){
		// get the name of the current html page
		var pages = currentUrl.split("/");
		var currentPage = pages[pages.length - 1].slice(0,
			pages[pages.length - 1].indexOf(".html"));

		// capitalize the first letter and execute the function
		currentPage = currentPage.charAt(0).toUpperCase()
			+ currentPage.slice(1);

		if( typeof window['on' + currentPage +'Load'] == 'function') {
			window['on' + currentPage + 'Load']();
		}
	}
}

function networkDetection() {
	if(isPhoneGapReady) {
		// as long as the connection type is not noe,
		// the device should have Internet access
		if( navigator.network.connection.type != Connection.NONE) {
			isConnected = true;
		}
	}
}

function onOnline(){
	isConnected = true;
}

function onOffline(){
	isConnected = false;
}

// This gets called by jQuery mobile when the page has loaded
$(document).on("pageload", function(event, data) {
	init(data.url);
});

// set an onload handler to call the init function
window.onload = init;