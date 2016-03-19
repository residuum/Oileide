# About Oileide

Oileide is a jQuery plugin for loading HTML and inserting it into the current page.

## Features

- markup based loading of HTML to insert into elements on page
- replace current content or append to it
- loading indicators is shown

## Quick start

1. Include `jquery.oileide.js` in your HTML.
2. Include links to loadable content with `<a href="url_to_load" data-oileide-target="target">link text</a>`, e.g. `<a href="mydata.html" data-oileide-target="#replaceMe">load mydata.html</a>`. 
3. Include `$.fn.oileide.run()` in your Javascript, preferable in an onload handler, e.g. with `$(function(){$.fn.oileide.run();})`
4. When clicking on the link, the following will happen:
    1. The content of `target` will be replaced with a loading indicator, here the element with the id `replaceMe`.
    2. A GET request for `url_to_load` will be issued.
    3. After the request is successful, the HTML will be cleaned of unwanted elements for inserting, i.e. all elements with class `.olympic` will be removed.
    4. The content of `target` will be replaced with the cleaned content.
    5. The content of `target` will be scanned for links to append Oileide to.

## Additional parameters for loading HTML
There is more functionality available in Oileide:

- If you want to append the content to the element instead of replacing it, add `data-oileide-append="true"` to the link.
- If your link has an `id`, then a fragment indentifier will be appended to the URL.

## Using Link `id`
If the triggering link contains an `id` attribute, then the ID will be appended to the location identifier of the URL, i.e. after the `#`.

Multiple IDs are appended comma seperated.

During the execution of `$.fn.oileide.run()` the location identifier is read, and the comma seperated values are extracted. If links with corresponding IDs are found in the location identifier, then these links will be triggered in the specified order. 

As these requests will be made synchronously, even links in loaded content will be triggered.

## Styling Loading Indicator
The loading indicator is a div with class `cassandras-veil`. Style it with CSS as you like. Standard styling is in `oileide.css`:

    @media screen
    {
	    div.cassandras-veil {
            position: absolute; 
            background-color:#000; 
            opacity:0.7; 
            filter: alpha(opacity = 70);
        }
	    div.cassandras-veil img {
            position: absolute; 
            top: 50%; 
            left: 50%; 
            margin-top: -14px; 
            margin-left: -14px;
        }
    }

You can also set your own loading indicator at starting Oileide by calling `$.fn.oileide.run(loadingIndicator)` with `loadingIndicator` being a jQuery object, e.g. 

    $.fn.oileide.run($('<div style="loading">Loading ... please wait.</div>'));

## Trigger Load from Javascript
Triggering loading of HTML and inserting into a target can be done by calling

    $.fn.insertHtml(url, target, append);

with the following parameters:

- `url`: URL to load, e.g. `"/test.html"`.
- `target`: Selector for inserting, e.g. `"#replaceThis"`.
- `append`: boolean value to indicate whether the content should be appended to the target or replace the current content.

## Why Oileide?

In the Trojan War, there were two Greek heroes named Ajax, Ajax son of
Telemon, called the Great, and Ajax the Lesser, king of Locris. The
latter was the son of Oileus, therefore yielding the cognomen Oileide.
So Oileide is Ajax the Lesser. 

Some more mythology about him: Ajax the Lesser was a fast runner, only 
second to Achilleus, and beaten by Odysseus on Patroklos's funeral, because
Athena tripped him. He was also renowned for his expertise with the spear, 
and raped Cassandra during the sack of Troy (That is why the overlays over 
the divs have the class "cassandras-veil"). And because several Olympic gods
took part invisibly in the Trojan War on both sides, the elements of the
loaded documents that should not be displayed need the class "olympic".

See [Wikipedia](http://en.wikipedia.org/wiki/Ajax_the_lesser)
