## 7segment.js

A (very) small js class to display a 7 segment display in a webpage. The display is svg based.

**Features:**

* number of digits
* decimal dot
* scaling
* bgcolor
* fgcolor
* class, so reusable

**Basic usage:**

1. include:
   ```<script src="7segment.js"></script>```
2. instantiate:
   ```const display4 = new SegmentDisplay("display4", 8, 25, "black", "darkgrey");```
   ```constructor(parentId, digitCount = 4, scale = 1, bgColor = "#422", fgColor = "red")```
3. set:
   ```display4.displayNumber("00000314", [false, false, false, false, false, true, false, false]);```

### Why?

Sometimes you just want to have a webpagecomponent just looking like a real display. I did several based on fonts which all resulted in including a quite big font, often with copyright issues. Since i do a lot with microcontrollers I really wanted a more "real" solution possibly with a smaller footprint. This is the answer.
The .js file is about 9kB and can be compressed to 3k. (probably less when using js-minification as well) This is a reasonable size on a ESP32 or ESP8266 for example.
