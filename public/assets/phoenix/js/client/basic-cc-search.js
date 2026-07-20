let search_query = '';

function search() {
    search_query = $( ".cc-searcher" ).val();
    window.location.href = "/search/?s=" + search_query + '&cat=' + window.category_id;
}

const input = document.querySelector(".cc-searcher");
input.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        search();
    }
});

document.querySelector(".cc-search-btn").addEventListener("click", search);