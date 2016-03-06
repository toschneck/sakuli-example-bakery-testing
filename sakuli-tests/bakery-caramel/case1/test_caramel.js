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
var $countOfClicks = 4;

try {
    checkChrome();
    checkUbuntuOS();
    cleanupReport("Reset caramel");
    testCase.endOfStep("clean report server", 5);

    _navigateTo($bakeryURL);
    moveAmountSlider();
    testCase.endOfStep("move amount slider", 20);

    placeCaramelOrder();
    testCase.endOfStep("place orders", 10);

    _navigateTo($reportURL);
    validateHtmlReportView();
    testCase.endOfStep("validate report amount", 10);

    //open print preview and validate it
    validatePrintPreview();
    env.sleep($sleep4Prasentation);
    testCase.endOfStep("validate print preview", 15);


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
    var bubble = screen.find("bubble.png").highlight();
    bubble.dragAndDropTo(bubble.right(135).highlight());
    //assert value of bubble is 30
    _assertEqual(30, Number(_getText(_div("slider slider-horizontal"))));


}


function placeCaramelOrder() {
    clickHighlight(_label("caramel"));
    for (i = 0; i < $countOfClicks; i++) {
        env.sleep($sleep4Prasentation);
        clickHighlight(_submit("Place order"));
    }

    env.sleep($sleep4Prasentation);
    var $submittedSpans = _collect("_span", /Submitted 'caramel' order.*/);

    _assertEqual($countOfClicks, $submittedSpans.length);
    $submittedSpans.forEach(function ($span) {
        _highlight($span);
        _isVisible($span);
    });
}


function validateHtmlReportView() {
    _highlight(_heading1("Cookie Bakery Reporting"));
    clickHighlight(_link("Reload"));
    _highlight(_span("caramel"));

    var $caramelReportIdentifier = _div("progress-bar[2]");
    _highlight($caramelReportIdentifier);
    var $caramelValue = _getText($caramelReportIdentifier);
    Logger.logInfo("caramel:" + $caramelValue);
    _assertEqual($countOfClicks * 30, Number($caramelValue), "Number of caramel orders does not fit!");
    //also do screen varification
    screen.find("pic_caramel.png").grow(50).highlight().find("web_caramel_120.png").highlight();
    env.sleep($sleep4Prasentation);
}


function validatePrintPreview() {
    if (_isFF()) {
        env.type("fv", Key.ALT);
    } else {
        env.type("p", Key.CTRL);
    }
    env.setSimilarity(0.8);
    screen.waitForImage("report_header.png", 5).highlight();
    screen.find("print_pic_caramel.png").highlight();
    var caramelRegion = screen.find("report_caramel.png").highlight();
    var caramelValueRegion = caramelRegion.below(100).highlight().find("report_value_120.png").highlight();

    var ocrValue = caramelValueRegion.extractText();   //experimental works only on a few font arts
    Logger.logInfo("caramel value: " + ocrValue);
}


function clickHighlight($selector) {
    _highlight($selector);
    _click($selector);
}