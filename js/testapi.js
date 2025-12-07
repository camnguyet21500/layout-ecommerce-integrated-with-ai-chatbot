console.log("testapi");
const baseUrl = "https://ecommerce-integrated-with-ai-chatbot.onrender.com/api"

fetch(`${baseUrl}/auth/sign-in`, {

    method: 'POST',
    headers: {

        'Content-Type': 'application/json'

    },

    body: JSON.stringify({

        "email": "nvo28@example.com",

        "password": "nvo28"

    })

})

    .then(res => res.json())

    .then(data => console.log(data))

    .catch(err => console.error(err));

