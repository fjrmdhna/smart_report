// src/components/Notification.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

const Notification = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = [
    {
      id: 1,
      title: 'Discussion about Dashboard',
      content: "Let's discuss the features that need to be added to the dashboard.",
      author: 'User1',
      createdAt: '2024-10-28',
      commentsCount: 5,
      comments: [
        {
          id: 1,
          author: 'User2',
          content: 'I think we need to add new graphics.',
          createdAt: '2024-10-28',
        },
        {
          id: 2,
          author: 'User3',
          content: 'Agreed, and also perhaps a more detailed filter feature.',
          createdAt: '2024-10-29',
        },
      ],
    },
    {
      id: 2,
      title: 'Latest Data Visualization',
      content: 'What do you think of the newly added data visualizations?',
      author: 'User2',
      createdAt: '2024-10-29',
      commentsCount: 3,
      comments: [
        {
          id: 1,
          author: 'User4',
          content: 'The visualization is very helpful!',
          createdAt: '2024-10-29',
        },
        // Tambahkan Comment dummy lainnya jika diperlukan
      ],
    },
    // Tambahkan topik lainnya jika diperlukan
  ];

  const handleViewDiscussion = (topic) => {
    setSelectedTopic(topic);
  };

  const handleBackToList = () => {
    setSelectedTopic(null);
  };

  const renderDiscussionList = () => (
    <div>
      <Button variant="primary" className="mb-3">
      Create a New Topic
      </Button>
      <div>
        {topics.map((topic) => (
          <Card key={topic.id} className="custom-card mb-3">
            <Card.Body>
              <Card.Title>{topic.title}</Card.Title>
              <Card.Text>{topic.content.substring(0, 100)}...</Card.Text>
              <small className="text-muted">
                Posted by {topic.author} on {topic.createdAt} | {topic.commentsCount} Comment
              </small>
              <div className="mt-3">
                <Button variant="primary" onClick={() => handleViewDiscussion(topic)}>
                  See Discussion
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDiscussionDetail = () => (
    <div>
      <Button variant="secondary" className="mb-3" onClick={handleBackToList}>
      Back to Discussion List
      </Button>
      <Card className="mb-3 custom-card">
        <Card.Body>
          <Card.Title>{selectedTopic.title}</Card.Title>
          <Card.Text>{selectedTopic.content}</Card.Text>
          <small className="text-muted">
            Posted by {selectedTopic.author} on {selectedTopic.createdAt}
          </small>
        </Card.Body>
      </Card>

      <div>
        <h5>{selectedTopic.comments.length} Comment</h5>
        {selectedTopic.comments.map((comment) => (
          <Card className="mb-2 custom-card" key={comment.id}>
            <Card.Body>
              <Card.Text>{comment.content}</Card.Text>
              <small className="text-muted">
                Posted by {comment.author} on {comment.createdAt}
              </small>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Form className="mt-4">
        <Form.Group controlId="commentContent">
          <Form.Label>Add Comment</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Write your Comment here..." />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-2">
          Send Comment
        </Button>
      </Form>
    </div>
  );

  return (
    <Container fluid className="px-3 mt-4"> {/* Menambahkan kelas mt-4 */}
      <Row>
        <Col xs={12}>
          {selectedTopic ? renderDiscussionDetail() : renderDiscussionList()}
        </Col>
      </Row>
    </Container>
  );
};

export default Notification;
