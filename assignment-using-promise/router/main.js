module.exports = function(app, request, cheerio, Q) {
    app.get('/I/want/title/', myCallback);
    addresses = [];
    asyncTasks = [];
    /**
     * Handle the get request 
     * @param {onject}req, res,next 
     * @return 
     */
    function myCallback(req, res, next) {
            var queryParam = req.param('address');
            if (typeof(queryParam) !== 'undefined') {
                addresses = getUrlsArray(queryParam);
                addresses.forEach(function(url) {
                    processUrl(url);
                });
                Q.all(asyncTasks)
                    .then(function(titles) {
                        console.log(titles)
                        renderView(req, res, next, titles);
                    }, function(error) {
                        console.log(error)
                        renderView(req, res, next, ['  NO response']);
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
    function getUrlsArray(queryParam) {
            if (queryParam instanceof Array) {

                addresses = queryParam;
            } else {
                addresses.push(queryParam);
            }
            return addresses;

        }
        /**
         * Render the view 
         * @param Http req and res object
         * @return 
         */
    function renderView(req, res, next, titles) {
            res.render('indexs.html', {
                titles: titles
            });
            addresses = [];
            asyncTasks = [];
        }
        /**
         * Process the url and call the request object
         * @param url
         * @return 
         */
    var processUrl = function(url) {
            var localUrl = url;
            if (localUrl.indexOf('http://') == -1) {
                localUrl = 'http://' + localUrl
            }
            asyncTasks.push(doHttpRequest(localUrl));
        }
        /**
         * Do Http request on given url and parse the Html and get the title
         * @param url
         * @return title 
         */
    function doHttpRequest(url) {
        return request(url).then(function(resultParams) {
            var $ = cheerio.load(resultParams[1]);
            return url + " - " + $("title").text();
        });

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