//-------------------------------------------------------------------------------------------------------
// Copyright (C) 2016 Intel Corporation.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------
this.WScript.LoadScriptFile("..\\UnitTestFramework\\SimdJsHelpers.js");
function asmModule(stdlib, imports) {
    "use asm";
    var ui16 = stdlib.SIMD.Uint8x16;
    var ui16check = ui16.check;
    var ui16addSaturate = ui16.addSaturate;
    var ui16subSaturate = ui16.subSaturate;
 
    var globImportui16 = ui16check(imports.g1);     

    var ui16g1 = ui16(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);      
    var ui16g2 = ui16(256, 255, 128, 127, 0, 0, 1000, 1000, 5, 15, 3, 399, 299, 21, 45, 22);

    var loopCOUNT = 3;

    function testAddSaturateLocal()
    {
        var a = ui16(80, 70, 60, 50, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
        var b = ui16(200, 200, 200, 200, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 255);
        var result = ui16(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        var loopIndex = 0;

        while ( (loopIndex|0) < (loopCOUNT|0)) {
            result = ui16addSaturate(a, b);
            loopIndex = (loopIndex + 1) | 0;
        }

        return ui16check(result);
    }
    
    function testSubSaturateLocal()
    {
        var a = ui16(80, 70, 60, 50, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
        var b = ui16(200, 200, 200, 200, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 255);
        var result = ui16(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        var loopIndex = 0;

        while ( (loopIndex|0) < (loopCOUNT|0)) {
            result = ui16subSaturate(a, b);
            loopIndex = (loopIndex + 1) | 0;
        }

        return ui16check(result);
    }

    function testAddSaturateGlobal()
    {
        var result = ui16(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        var loopIndex = 0;

        while ( (loopIndex|0) < (loopCOUNT|0)) {
            result = ui16addSaturate(ui16g1, ui16g2);
            loopIndex = (loopIndex + 1) | 0;
        }

        return ui16check(result);
    }
    
    function testSubSaturateGlobal()
    {
        var result = ui16(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        var loopIndex = 0;

        while ( (loopIndex|0) < (loopCOUNT|0)) {
            result = ui16subSaturate(ui16g1, ui16g2);
            loopIndex = (loopIndex + 1) | 0;
        }

        return ui16check(result);
    }
    
    function testAddSaturateGlobalImport()
    {
        var a = ui16(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
        var result = ui16(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        var loopIndex = 0;

        while ( (loopIndex|0) < (loopCOUNT|0)) {
            result = ui16addSaturate(globImportui16, a);
            loopIndex = (loopIndex + 1) | 0;
        }

        return ui16check(result);
    }
    
    function testSubSaturateGlobalImport()
    {
        var a = ui16(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
        var result = ui16(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        var loopIndex = 0;

        while ( (loopIndex|0) < (loopCOUNT|0)) {
            result = ui16subSaturate(globImportui16, a);
            loopIndex = (loopIndex + 1) | 0;
        }

        return ui16check(result);
    }
    
    return { testAddSaturateLocal: testAddSaturateLocal, testSubSaturateLocal: testSubSaturateLocal, testAddSaturateGlobal: testAddSaturateGlobal, testSubSaturateGlobal: testSubSaturateGlobal, testAddSaturateGlobalImport: testAddSaturateGlobalImport, testSubSaturateGlobalImport: testSubSaturateGlobalImport };
}

var m = asmModule(this, {g1:SIMD.Uint8x16(100, 255, 255, 255, 0, 38, 255, 1442, 52, 127, 254, 256, 129, 0, 88, 100234)});

equalSimd([255, 255, 255, 250, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 255], m.testAddSaturateLocal(), SIMD.Uint8x16, "Func1");
equalSimd([0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 5, 7, 9, 11, 13, 0], m.testSubSaturateLocal(), SIMD.Uint8x16, "Func2");
equalSimd([1, 255, 131, 131, 5, 6, 239, 240, 14, 25, 14, 155, 56, 35, 60, 38], m.testAddSaturateGlobal(), SIMD.Uint8x16, "Func3");
equalSimd([1, 0, 0, 0, 5, 6, 0, 0, 4, 0, 8, 0, 0, 0, 0, 0], m.testSubSaturateGlobal(), SIMD.Uint8x16, "Func4");
equalSimd([101, 255, 255, 255, 5, 44, 255, 170, 61, 137, 255, 12, 142, 14, 103, 154], m.testAddSaturateGlobalImport(), SIMD.Uint8x16, "Func5");
equalSimd([99, 253, 252, 251, 0, 32, 248, 154, 43, 117, 243, 0, 116, 0, 73, 122], m.testSubSaturateGlobalImport(), SIMD.Uint8x16, "Func6");
print("PASS");