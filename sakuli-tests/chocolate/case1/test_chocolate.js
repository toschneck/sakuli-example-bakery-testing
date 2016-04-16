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
var $bakeryURL = "http://bakery-web-server:8080/bakery/";
var $reportURL = "http://bakery-report-server:8080/report/";
var $countOfClicks = 2;

try {
    checkChrome();
    checkUbuntuOS();
    cleanupReport("Reset chocolate");
    testCase.endOfStep("clean report server", 10);

    _navigateTo($bakeryURL);
    moveAmountSlider();
    testCase.endOfStep("move amount slider", 25);

    placeChocolateOrder();
    testCase.endOfStep("place orders", 15);

    _navigateTo($reportURL);
    validateHtmlReportView();
    testCase.endOfStep("validate report amount", 15);

    //open print preview and validate it
    validatePrintPreview();
    env.sleep($sleep4Prasentation);
    testCase.endOfStep("validate print preview", 20);


} catch (e) {
    testCase.handleException(e);
} finally {
    //env.sleep(9999);
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
        if (_isChrome()) {
            testCase.addImagePaths("ubuntu/chrome");

        }
    }
}


function cleanupReport($linkname) {
    _navigateTo($reportURL);
    clickHighlight(_link($linkname));
}


function moveAmountSlider() {
    var bubble = screen.waitForImage("bubble.png",10).highlight();
    bubble.dragAndDropTo(bubble.left(35).highlight());
    //assert value of bubble is 10
    _assertEqual(30, Number(_getText(_div("slider slider-horizontal"))));

}


function placeChocolateOrder() {
    clickHighlight(_label("chocolate"));
    for (i = 0; i < $countOfClicks; i++) {
        env.sleep($sleep4Prasentation);
        clickHighlight(_submit("Place order"));
    }

    env.sleep($sleep4Prasentation);
    var $submittedSpans = _collect("_span", /Submitted 'chocolate' order.*/);

    _assertEqual($countOfClicks, $submittedSpans.length);
    $submittedSpans.forEach(function ($span) {
        _highlight($span);
        _isVisible($span);
    });
}


function validateHtmlReportView() {
    _highlight(_heading1("Cookie Bakery Reporting"));
    clickHighlight(_link("Reload"));
    _highlight(_span("chocolate"));

    var $chocolateReportIdentifier = _div("progress-bar[0]");
    _highlight($chocolateReportIdentifier);
    var $chocolateValue = _getText($chocolateReportIdentifier);
    Logger.logInfo("chocolate:" + $chocolateValue);
    _assertEqual($countOfClicks * 10, Number($chocolateValue), "Number of chocolate orders does not fit!");
    //also do screen varification
    screen.find("pic_chocolate.png").grow(50).highlight().find("web_chocolate_20.png").highlight();
    env.sleep($sleep4Prasentation);
}


function validatePrintPreview() {
    if (_isFF()) {
        env.type("fv", Key.ALT);
    } else {
        env.type("p", Key.CTRL);
    }
    env.setSimilarity(0.8);
    screen.waitForImage("report_header.png", 10).highlight();
    screen.find("report_pic_chocolate.png").highlight();
    var chocolateRegion = screen.find("report_chocolate.png").highlight();
    var chocolateValueRegion = chocolateRegion.below(100).highlight().find("report_value_20.png").highlight();

    var ocrValue = chocolateValueRegion.extractText();   //experimental works only on a few font arts
    Logger.logInfo("chocolate value: " + ocrValue);
}


function clickHighlight($selector) {
    _highlight($selector);
    _click($selector);
}