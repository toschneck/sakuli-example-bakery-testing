/*
 * Sakuli - Testing and Monitoring-Tool for Websites and common UIs.
 *
 * Copyright 2013 - 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

_dynamicInclude($includeFolder);
var testCase = new TestCase(60, 70);
var env = new Environment();
var screen = new Region();

var $sleep4Prasentation = 0;
//var $bakeryURL = "http://localhost:18001/bakery/";
var $bakeryURL = "http://bakery-web-server:8080/bakery/";
//var $reportURL = "http://localhost:18002/report/";
var $reportURL = "http://bakery-report-server:8080/report/";
var $countOfClicks = 3;

try {
    checkChrome();
    checkUbuntuOS();
    cleanupReport("Reset blueberry");
    testCase.endOfStep("clean report server", 5);


    _navigateTo($bakeryURL);
    var bubble = screen.find("bubble.png").highlight();
    bubble.dragAndDropTo(bubble.right(30).highlight());

    //assert value of bubble is 20
    _assertEqual(20, Number(_getText(_div("slider slider-horizontal"))));
    for (i = 0; i < $countOfClicks; i++) {
        env.sleep($sleep4Prasentation);
        _highlight(_submit("Place order"));
        _click(_submit("Place order"));
    }
    testCase.endOfStep("move amount slider", 20);


    env.sleep($sleep4Prasentation);
    var $bluberryIdentifier = /Submitted 'blueberry' order.*/;
    _isVisible(_span($bluberryIdentifier));
    var $submittedSpans = _collect("_span", $bluberryIdentifier);

    _assertEqual($countOfClicks, $submittedSpans.length);
    $submittedSpans.forEach(function ($span) {
        _highlight($span);
    });
    testCase.endOfStep("place orders", 10);

    _navigateTo($reportURL);
    _highlight(_heading1("Cookie Bakery Reporting"));
    _highlight(_span("blueberry"));
    _highlight(_link("Reload"));
    _click(_link("Reload"));

    var $blueberryIdentifier = _div("progress-bar[1]");
    _highlight($blueberryIdentifier);
    var $blueberryVal = _getText($blueberryIdentifier);
    Logger.logInfo("blueberry:" + $blueberryVal);
    _assertEqual($countOfClicks * 20, Number($blueberryVal), "Number of blueberry orders does not fit!");
    //also do screen varification
    screen.find("pic_blueberries.png").grow(50).highlight().find("web_blueberry_60.png").highlight();
    env.sleep($sleep4Prasentation);
    testCase.endOfStep("validate report amount", 10);

    //open print preview and validate it
    validatePrintPreview();
    env.sleep($sleep4Prasentation);
    testCase.endOfStep("validate print preview", 15);


} catch (e) {
    testCase.handleException(e);
    //env.sleep(9999);
} finally {
    testCase.saveResult();
}

function checkChrome() {
    if (_isChrome()) {
        Logger.logInfo('Detected browser: Chorme  >> override some image patterns');
        testCase.addImagePaths("chrome");
    }
}

function checkUbuntuOS() {
    var dist = env.runCommand('cat /etc/os-release').getOutput();
    if (dist.match(/NAME=.*Ubuntu.*/)) {
        Logger.logInfo('Detected distribution: Ubuntu  >> override some image patterns');
        testCase.addImagePaths("ubuntu");
    }
    if (_isChrome()) {
        testCase.addImagePaths("ubuntu/chrome");
    }
}

function validatePrintPreview() {
    if (_isFF()) {
        env.type("fv", Key.ALT);
    } else {
        env.type("p", Key.CTRL);
    }
    env.setSimilarity(0.8);
    screen.waitForImage("report_header.png",5).highlight();
    screen.find("print_pic_blueberries.png").highlight();
    var blueberryRegion = screen.find("report_blueberry.png").highlight();
    var blueberryValueRegion = blueberryRegion.below(100).highlight().find("report_value_60.png").highlight();

    var ocrValue = blueberryValueRegion.extractText();   //experimental works only on a few font arts
    Logger.logInfo("blueberry value: " + ocrValue);
}

function cleanupReport($linkname) {
    _navigateTo($reportURL);
    _highlight(_link($linkname));
    _click(_link($linkname));
}
