// const weatherForm = document.querySelector("form")
// const search = document.querySelector("input[name=address]")

// weatherForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const location = search.value

//     console.log(location);

//     fetch("/weather?address=" + location).then((response) => {
//         response.json().then((data) => {

//             if (data.error) {
//                 console.log(data.error)
//             } else {
//                 console.log(data)
//             }
//         })
//     })

// })