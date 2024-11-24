import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';

const Dashboard = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const LLM_API_URL = 'https://e324-130-65-254-15.ngrok-free.app/response';

  // Summarize Notes
  const handleSummarize = async () => {
    try {
      const response = await fetch('https://e324-130-65-254-15.ngrok-free.app/response', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
      },
        body: JSON.stringify({ userPrompt: inputText }),
      });
      const data = await response.json();
      console.log(data);
      setOutputText(data.summary);
      setNotifications((prev) => [...prev, `New Summary: ${data.summary}`]);
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  };

  // Ask Question
  const handleAskQuestion = async () => {
    try {
      const response = await fetch(LLM_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: outputText,
          question: question,
        }),
      });

      const data = await response.json();
      const llmAnswer = data.choices[0]?.message?.content || 'No response from LLM';
      setAnswer(llmAnswer);
    } catch (error) {
      console.error('Error fetching answer:', error);
      setAnswer('Error generating answer. Please try again.');
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Left Column: Notifications */}
      <Grid item xs={3} sx={{ backgroundColor: '#f5f5f5', padding: 2, overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <List>
          {notifications.map((notification, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={notification} />
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Right Column: Main Content */}
      <Grid item xs={9} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Note Summarization Dashboard
        </Typography>

        {/* Input Text */}
        <Paper sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h6">Input Notes or Speech</Typography>
          <TextField
            id="input-notes"
            label="Enter Notes"
            variant="outlined"
            multiline
            rows={5}
            fullWidth
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleSummarize}
          >
            Summarize
          </Button>
        </Paper>

        {/* Output Text */}
        <Paper sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h6">Summarized Notes</Typography>
          <TextField
            id="output-summary"
            label="Summary"
            variant="outlined"
            multiline
            rows={5}
            fullWidth
            value={outputText}
            InputProps={{ readOnly: true }}
          />
        </Paper>

        {/* Question Box */}
        <Paper sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h6">Ask Questions About the Summary</Typography>
          <TextField
            id="question-box"
            label="Enter Your Question"
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: 2 }}
            onClick={handleAskQuestion}
          >
            Generate Answer
          </Button>
        </Paper>

        {/* Display Answer */}
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6">Answer</Typography>
          <TextField
            id="answer-box"
            label="Answer to Your Question"
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            value={answer}
            InputProps={{ readOnly: true }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
