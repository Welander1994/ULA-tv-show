const express = require('express');
const fetch = require('node-fetch'); // Ensure you're using node-fetch for server-side fetch
const app = express();

// Middleware to parse JSON bodies
app.use(express.json()); 

const createContent = async (contentData) => {
    const url = 'https://api.umbraco.io/content'; 
    
    // Storing the API key in an environment variable for security
    const apiKey = 'hlqgkhL6TDMBWkYM6zy1';
   

    try {
        const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
                'Accept-Language': 'en-US',
                'Umb-Project-Alias': 'ula-tv-show', 
                'Api-Key': apiKey 
            },
            body: JSON.stringify(contentData)
        });

        if (!response.ok) {
            // Log detailed error from the response
            const errorData = await response.json();
            console.error('Error details:', JSON.stringify(errorData, null, 2));  // Log the detailed error response in a readable format
            throw new Error(`Error: ${response.status} - ${errorData.title || errorData.message}`);
        }

        const data = await response.json();
        console.log('Content created:', data);

    } catch (error) {
        console.error('Error creating content:', error);
    }
};

const createMedia = async () => {
    const url = 'https://api.umbraco.io/media'; 
    
    // Storing the API key in an environment variable for security
    const apiKey = 'hlqgkhL6TDMBWkYM6zy1';
   
    const mediaData =
    {
        "mediaTypeAlias": "Image",
        "name": "Han Solo2",
        "umbracoFile": { "src": "https://as2.ftcdn.net/v2/jpg/04/38/82/85/360_F_438828559_QccWdc3zAULf7uLTzekIt5XlOEnGj6X0.jpg" }
    }
    

    try {
        const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
                'Accept-Language': 'en-US',
                'Umb-Project-Alias': 'ula-tv-show', 
                'boundary' : 'MultipartBoundry',
                'Api-Key': apiKey 
            },
            body: JSON.stringify(mediaData)
        });

        if (!response.ok) {
            // Log detailed error from the response
            const errorData = await response.json();
            console.error('Error details:', JSON.stringify(errorData, null, 2));  // Log the detailed error response in a readable format
            throw new Error(`Error: ${response.status} - ${errorData.title || errorData.message}`);
        }

        const data = await response.json();
        console.log('Content created:', data);
        return(data);
    } catch (error) {
        console.error('Error creating content:', error);
    }
};




const fetchData = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
        const data = await response.json();

        console.log('id:', id);
        console.log('Summary:', data.summary); // Logs summary
        console.log('Genres:', data.genres); // Logs genres
        console.log('Image:', data.image); // Logs image
        console.log('Show ID:', data.id); // Logs id

        // Send data as JSON to the client
        res.json(data);

        const media = await createMedia();
        const neededMedia = await JSON.stringify(media.umbracoFile.src);

        console.log("returned media: " + neededMedia);  

        const contentData = {
            "_creatorName": "Jacob Welander Jensen",
            "_writerName": "Jacob Welander Jensen",
            "contentTypeAlias": "tVShow",
            "_hasChildren": false,
            "_level": 2,
            // Correct the 'name' field to be an object with both 'en-us' and invariant values
            "name": {
              "$invariant": data.name
            },
            "summary": {
                "$invariant": data.summary
              },
            "image": {
                "$invariant": data.summary
              },
            "parentId": "cb82598e-2cda-47e7-b62e-f0561023cf59",
            "sortOrder": 0,
            "_createDate": "2025-02-26T10:19:37.643Z",
            "_id": "d4fde592-cc26-489e-9ac8-f793c4737f62",
            "_updateDate": "2025-02-26T10:28:18.457Z",
            // Fix ShowId by making it an object with 'en-us'
            "ShowId": {
              "$invariant": data.id // Correct format for ShowId with language support
            }
        };
        // console.log(contentData);
        // Call createContent() after sending the response
        // await createContent(contentData);  // Ensure this waits for completion if you need to

    } catch (error) {
        console.error('Fetch Error:', error); // Log the actual error
        res.status(500).json({ error: 'Error fetching data' });
    }
};

app.get('/', (req, res) => {
    res.send('Hello, Node.js! This is a test');
});

// Route to fetch TV show from an external API corresponding to the id in the URL 
app.get('/api/show/:id', fetchData);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
