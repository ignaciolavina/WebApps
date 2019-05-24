let processBooks = function () {
    let index = 0;
    app.products.map((book) => {
        Vue.set(book, 'index', index++);
        Vue.set(book, 'showReviews', false);
        Vue.set(book, 'yourReview', { body: '' });
        Vue.set(book, 'otherReviews', []);
        Vue.set(book, 'isHidden', false);
    });
};

let getAllBooks = function () {
    $.getJSON(getAllBooksUrl, function (response) {
        app.products = response.products;
        processBooks();
    });
};

let getLoggedInUser = function (callback) {
    $.getJSON(getLoggedInUserUrl, function (response) {
        app.loggedInUser = response.user;
        callback();
    });
};

let onPageLoad = function () {
    getLoggedInUser(function () {
        getAllBooks();
    });
};

let getYourReview = function (bookIndex) {
    // exit the function if the user is not logged in
    if (app.loggedInUser == undefined) {
        return;
    }

    let book = app.products[bookIndex];

    $.getJSON(getYourReviewUrl, { product_id: book.id, email: app.loggedInUser }, function (response) {
        if (response.review != null) {
            book.yourReview = response.review;
        }
        Vue.set(book.yourReview, 'hasBeenSaved', false);
    });
};

let getOtherReviews = function (bookIndex) {
    let book = app.products[bookIndex];
    $.getJSON(getOtherReviewsUrl, { product_id: book.id }, function (response) {
        book.otherReviews = response.other_reviews;
    });
};

let toggleReviewsSection = function (bookIndex) {
    let book = app.products[bookIndex];
    book.showReviews = !book.showReviews;
};

let saveReview = function (bookIndex) {
    // exit the function if the user is not logged in
    if (app.loggedInUser == undefined) {
        return;
    }

    let book = app.products[bookIndex];
    let yourReview = book.yourReview;
    yourReview.hasBeenSaved = false;

    $.post(saveReviewUrl, {
        product_id: book.id,
        email: app.loggedInUser,
        body: yourReview.body
    }, function (response) {
        yourReview.hasBeenSaved = true;
        setTimeout(function () {
            yourReview.hasBeenSaved = false;
        }, 1000);
    });
};

let app = new Vue({
    el: "#app",
    delimiters: ['${', '}'],
    unsafeDelimiters: ['!{', '}'],
    data: {
        products: [],
        loggedInUser: undefined
    },
    methods: {
        getYourReview: getYourReview,
        toggleReviewsSection: toggleReviewsSection,
        saveReview: saveReview
    }
});

onPageLoad();