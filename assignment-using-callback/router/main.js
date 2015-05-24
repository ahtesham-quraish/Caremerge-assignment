module.exports = function(app, request, cheerio) {
    app.get('/I/want/title/', myCallback);
    titles = [];
    addresses = [];
    /**
     * Handle the get request 
     * @param {onject}req, res,next 
     * @return 
     */
    function myCallback(req, res, next) {
            var address = req.param('address');
            if (typeof(address) !== 'undefined') {
                addresses = getUrlsArray(address);
                addresses.forEach(function(url) {
                    processUrl(url, function(title) {
                        titles.push(title)

                        if (addresses.length == titles.length) {
                            renderView(req, res, next);
                        }

                    });

                });


            } else {
                next();
            }

        }
        /**
         * Make the array of urls from queryParam
         * @param queryParam
         * @return array of addresses
         */
    function getUrlsArray(address) {
            if (address instanceof Array) {

                addresses = address;
            } else {
                addresses.push(address);
            }
            return addresses;

        }
        /**
         * Render the view 
         * @param Http req and res object
         * @return 
         */
    function renderView(req, res, next) {
            res.render('indexs.html', {
                titles: titles
            });
            titles = [];
            addresses = [];
        }
        /**
         * Do Http request on given url and parse the Html and get the title
         * @param url , callback
         * @return title 
         */
    var processUrl = function(url, callback) {
            if (url.indexOf('http://') == -1) {
                url = 'http://' + url
            }
            request(url, function(error, response, html) {
                var title;
                if (!error) {
                    var $ = cheerio.load(html);
                    console.log($("title").text());
                    callback($("title").text());

                } else {
                    callback(url + ' -  NO response');
                    console.log(error);
                }
            })


        }
        /**
         * Send response on page not found
         * @param 
         * @return 
         */
    app.get("*", function(request, response) {
        response.end("404!");
    });


}