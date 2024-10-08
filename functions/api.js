require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();


router.post('/create-task', async (req, res) => {
    try {
            const response = await axios.post('https://api.meshy.ai/v2/text-to-3d', JSON.stringify({ 
                mode: "preview",
                prompt: req.body.prompt,
            }), {
              headers: { 'Authorization': `Bearer ${process.env.MESHY_API_KEY}` }
            });
            console.log(response.data)
            res.json(response.data);
          } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ message: 'Failed to create task, reason: ' + JSON.stringify(error.response ? error.response.data : error)});
          }
});


router.post('/create-texture-task', async (req, res) => {
    try {
        const response = await axios.post('https://api.meshy.ai/v1/text-to-texture', {
            "model_url":req.body.model_url,
            "object_prompt": req.body.object_prompt,
            "style_prompt": req.body.style_prompt || "realistic",
            "enable_original_uv": req.body.enable_original_uv !== undefined ? req.body.enable_original_uv : true,
            "enable_pbr": req.body.enable_pbr !== undefined ? req.body.enable_pbr : true,
            "resolution": req.body.resolution || "2048",
          }, {
            headers: { 'Authorization': `Bearer ${process.env.MESHY_API_KEY}` }
        });
        
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error response:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to create texture task, reason: ' + JSON.stringify(error.response ? error.response.data : error)});
    }
});

router.get('/get-task/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://api.meshy.ai/v2/text-to-3d/${id}`, {
            headers: { 'Authorization': `Bearer ${process.env.MESHY_API_KEY}` }
        });
        
        console.log(response.data)
        res.json(response.data);
    } catch (error) {
        console.error('Error retrieving task:', error);
        res.status(500).json({ message: 'Failed to retrieve task' });
    }
});

router.get('/get-texture-task/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://api.meshy.ai/v1/text-to-texture/${id}`, {
            headers: { 'Authorization': `Bearer ${process.env.MESHY_API_KEY}` }
        });
        
        console.log(response.data)
        res.json(response.data);
    } catch (error) {
        console.error('Error retrieving texture task:', error);
        res.status(500).json({ message: 'Failed to retrieve texture task, reason: ' + error });
    }
});


app.use("/.netlify/functions/api",router);
module.exports.handler = serverless(app);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));