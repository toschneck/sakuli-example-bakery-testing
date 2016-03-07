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

var $sleep4Prasentation = 1;
var $bakeryURL = "http://bakery-web-server:8080/bakery/";

try {
    checkUbuntuOS();
    _navigateTo($bakeryURL);

    visibleHighlight(_heading1("Cookie Bakery Application"));

    [
        _label("chocolate"),
        _label("blueberry"),
        _label("caramel")]
        .forEach(function ($identifier) {
            visibleHighlight($identifier);
        });
    env.sleep($sleep4Prasentation);
    testCase.endOfStep("validate HTML view", 20);

    //open print preview
    env.type("p", Key.CTRL);


    //rotate to landscape
    screen.waitForImage("layout_label.png", 5).highlight()
        .right(140).highlight().click()
        .grow(0, 40)
        .find("landscape.png").click();
    env.sleep($sleep4Prasentation);
    testCase.endOfStep("rotate to landscap", 15);

    //save as pdf
    screen.find("save_button").highlight().click();
    env.sleep($sleep4Prasentation);
    env.type(Key.ENTER).sleep($sleep4Prasentation);

    //open pdf and validate
    env.type("tl", Key.CTRL).paste(getPDFpath()).type(Key.ENTER);
    env.sleep($sleep4Prasentation);
    screen.waitForImage("pdf_order_header", 5).highlight();
    [
        "pdf_blueberry",
        "pdf_caramel",
        "pdf_chocolate",
        "pdf_place_order"
    ].forEach(function (imgPattern) {
        screen.find(imgPattern).highlight();
    });
    testCase.endOfStep("validate PDF output", 30);

} catch (e) {
    testCase.handleException(e);
} finally {
    //env.sleep(9999);
    testCase.saveResult();
}

function getPDFpath() {
    if(isUbuntu()){
        return "file:///root/Documents/Cookie%20Bakery%20Application.pdf"
    }
    return "file:///root/Cookie%20Bakery%20Application.pdf";
}

function checkUbuntuOS() {
    if (isUbuntu()) {
        Logger.logInfo('Detected distribution: Ubuntu  >> override some image patterns');
        testCase.addImagePaths("ubuntu");

    }
    if (!_isChrome()) {
        throw "this test is onyl designed for the chrome printing function!"
    }
}

function isUbuntu() {
    return env.runCommand('cat /etc/os-release').getOutput().match(/NAME=.*Ubuntu.*/);
}

function visibleHighlight($selector) {
    _isVisible($selector);
    _highlight($selector);
}
