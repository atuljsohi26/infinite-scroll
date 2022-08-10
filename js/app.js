(function () {
    const quotesEl = document.querySelector('.quotes');
    const loaderEl = document.querySelector('.loader');

    // get the quotes from API
    const getQuotes = async (page, limit) => {
        console.log('page =', page);
        let API_URL = `https://www.pinkvilla.com/photo-gallery-feed-page`;
        if(page > 0) {
             API_URL = `https://www.pinkvilla.com/photo-gallery-feed-page/page/${page}`;
        }
        
        const response = await fetch(API_URL);
        // handle 404
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
        }
        return await response.json();
    }

    // show the quotes
    const showQuotes = (quotes) => {
        quotes.forEach(quote => {
            //console.log('quote =', quote);
            const quoteEl = document.createElement('blockquote');
            quoteEl.classList.add('quote');

            quoteEl.innerHTML = `
            <div class="row gx-5">
                <div class="col-md-3 mb-4">
                    <div class="bg-image hover-overlay ripple shadow-2-strong rounded-5" data-mdb-ripple-color="light">
                    <img src="https://www.pinkvilla.com/${quote.node.ImageStyle_thumbnail}" class="img-fluid" />
                    </div>
                </div>

                <div class="col-md-6 mb-4">
                    <h4><strong>${quote.node.title}</strong></h4>
                    <small>${quote.node.author_name}</small>
                </div>
            </div>
        `;

            quotesEl.appendChild(quoteEl);
        });
    };

    const hideLoader = () => {
        loaderEl.classList.remove('show');
    };

    const showLoader = () => {
        loaderEl.classList.add('show');
    };

    const hasMoreQuotes = (page, limit, total) => {
        const startIndex = (page - 1) * limit + 1;
        return total === 0 || startIndex < total;
    };

    // load quotes
    const loadQuotes = async (page, limit) => {

        // show the loader
        showLoader();

        // 0.5 second later
        setTimeout(async () => {
            try {
                // if having more quotes to fetch
                if (hasMoreQuotes(page, limit, total)) {
                    // call the API to get quotes
                    const response = await getQuotes(page, limit);
                    // show quotes
                    showQuotes(response.nodes);
                    // update the total
                    total = response.nodes.length;
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                hideLoader();
            }
        }, 500);

    };

    // control variables
    let currentPage = 0;
    const limit = 20;
    let total = 0;


    window.addEventListener('scroll', () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5 &&
            hasMoreQuotes(currentPage, limit, total)) {
            currentPage++;
            loadQuotes(currentPage, limit);
        }
    }, {
        passive: true
    });

    // initialize
    loadQuotes(currentPage, limit);

})();