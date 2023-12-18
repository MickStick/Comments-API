// describe('NO TEST IN COMMENT CONTROLLER', () => {
//     it('Non Test', () => {
//         expect(true).toBeTruthy()
//     })
// })

// Import the CommentController class and the required dependencies
const CommentController = require("../controllers/CommentController");
const CommentService = require("../services/CommentService");
const RestResponse = require('../utility/RestResponse');
const Log = require("../utility/Log");
const escapeHtml = require('escape-html');

// Mock the CommentService class using jest.mock
jest.mock("../services/CommentService");

// Create a mock instance of the CommentService class
const mockCommentService = new CommentService();

// Create an instance of the CommentController class
const commentController = new CommentController();

// Define some sample data for testing
const sampleBody = {
  name: "John Doe",
  email: "john.doe@example.com",
  comment: "This is a sample comment"
};

const samplePid = "1234567890";

const sampleDbRes = {
  _id: samplePid,
  name: sampleBody.name,
  email: sampleBody.email,
  comment: sampleBody.comment,
  status: 1
};

const sampleErrMsg = ["Name is required", "Email is invalid"];

// Define a mock function for sending a response
const mockSend = jest.fn();

// Define a mock function for setting the status code
const mockStatus = jest.fn(() => ({ send: mockSend }));

// Define a mock object for the request
const mockReq = {
  body: sampleBody,
  params: {
    pid: samplePid
  }
};

// Define a mock object for the response
const mockRes = {
  status: mockStatus,
  json: mockSend
};

// Define a helper function for creating a RestResponse object
const createRestResponse = (status, state, message, body) => {
  const response = new RestResponse();
  response.status = status;
  response.state = state;
  response.message = message;
  response.body = body;
  return response;
};

// Define a helper function for creating an error object
const createError = (message) => {
  const error = new Error(message);
  return error;
};

// Define a helper function for resetting the mock functions
const resetMocks = () => {
  mockCommentService.addCommentData.mockReset();
  mockCommentService.retreivePostComments.mockReset();
  mockCommentService.deleteComment.mockReset();
  mockSend.mockReset();
  mockStatus.mockReset();
};

// Use describe blocks to group related tests
describe("CommentController", () => {

  // Use beforeEach and afterEach hooks to run some code before and after each test
  beforeEach(() => {
    // Clear the mock instances and calls
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Reset the mock functions
    resetMocks();
  });

  // Use test or it blocks to write individual test cases
  test("registerComment should call addCommentData with sanitized body and send a success response", async () => {
    // Arrange
    // Set up the mock functions to return some values
    mockCommentService.addCommentData.mockResolvedValue(sampleDbRes);

    // Act
    // Call the method to be tested with the mock objects
    await commentController.registerComment(mockReq, mockRes);

    // Assert
    // Check if the mock functions were called with the expected arguments and the expected response was sent
    expect(mockCommentService.addCommentData).toHaveBeenCalledWith({
      name: escapeHtml(sampleBody.name),
      email: escapeHtml(sampleBody.email),
      comment: escapeHtml(sampleBody.comment),
      status: 1
    });
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith(createRestResponse(200, "success", "Comment has been added successfully!", sampleDbRes));
  });

  test("registerComment should send an error response if validateCommentBody returns an error message", async () => {
    // Arrange
    // Set up the mock functions to return some values
    commentController.validateCommentBody = jest.fn(() => sampleErrMsg);

    // Act
    // Call the method to be tested with the mock objects
    await commentController.registerComment(mockReq, mockRes);

    // Assert
    // Check if the mock functions were called with the expected arguments and the expected response was sent
    expect(commentController.validateCommentBody).toHaveBeenCalledWith(sampleBody);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith(createRestResponse(500, "error", "Validation Error!", createError(JSON.stringify(sampleErrMsg))));
  });

  test("registerComment should send an error response if addCommentData throws an error", async () => {
    // Arrange
    // Set up the mock functions to throw an error
    mockCommentService.addCommentData.mockRejectedValue(createError("Something went wrong! Contact admin for information!"));

    // Act
    // Call the method to be tested with the mock objects
    await commentController.registerComment(mockReq, mockRes);

    // Assert
    // Check if the mock functions were called with the expected arguments and the expected response was sent
    expect(mockCommentService.addCommentData).toHaveBeenCalledWith({
      name: escapeHtml(sampleBody.name),
      email: escapeHtml(sampleBody.email),
      comment: escapeHtml(sampleBody.comment),
      status: 1
    });
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith(createRestResponse(500, "error", "Internal Server Error!", createError("Something went wrong! Contact admin for information!")));
  });

  test("getComments should call retreivePostComments with pid and send a success response", async () => {
    // Arrange
    // Set up the mock functions to return some values
    mockCommentService.retreivePostComments.mockResolvedValue([sampleDbRes]);

    // Act
    // Call the method to be tested with the mock objects
    await commentController.getComments(mockReq, mockRes);

    // Assert
    // Check if the mock functions were called with the expected arguments and the expected response was sent
    expect(mockCommentService.retreivePostComments).toHaveBeenCalledWith(samplePid);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith(createRestResponse(200, "success", "Comments have been retreived!", [sampleDbRes]));
  });

  test("getComments should send an error response if retreivePostComments returns null or undefined", async () => {
    // Arrange
    // Set up the mock functions to return null
    mockCommentService.retreivePostComments.mockResolvedValue(null);

    // Act
    // Call the method to be tested with the mock objects
    await commentController.getComments(mockReq, mockRes);

    // Assert
    // Check if the mock functions were called with the expected arguments and the expected response was sent
    expect(mockCommentService.retreivePostComments).toHaveBeenCalledWith(samplePid);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith(createRestResponse(500, "error", "Internal Server Error!", createError("Something went wrong! Contact admin for information!")));
  });

  test("getComments should send an error response if retreivePostComments returns an empty array", async () => {
    // Arrange
    // Set up the mock functions to return an empty array
    mockCommentService.retreivePostComments.mockResolvedValue([]);

    // Act
    // Call the method to be tested with the mock objects
    await commentController.getComments(mockReq, mockRes);

    // Assert
    // Check if the mock functions were called with the expected arguments and the expected response was sent
    expect(mockCommentService.retreivePostComments).toHaveBeenCalledWith(samplePid);
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockSend).toHaveBeenCalledWith(createRestResponse(404, "error", "Internal Server Error!", createError("Cannot find any Comment records!")));
  });

  test("getComments should send an error response if retreivePostComments throws an error", async () => {
    // Arrange
    // Set up the mock functions to throw an error
    mockCommentService.retreivePostComments.mockRejectedValue(createError("Something went wrong! Contact admin for information!"));

    // Act
    // Call the method to be tested with the mock objects
    await commentController.getComments(mockReq, mockRes);

    // Assert
    // Check if the mock functions were called with the expected arguments and the expected response was sent
    expect(mockCommentService.retreivePostComments).toHaveBeenCalledWith(samplePid);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockSend).toHaveBeenCalledWith(createRestResponse(500, "error", "Internal Server Error!", createError("Something went wrong! Contact admin for information!")));
  });

  test("deleteComment should call deleteComment with pid and send a success response", async () => {
    // Arrange
    // Set up the mock functions to return some values
    mockCommentService.deleteComment.mockResolvedValue(sampleDbRes);

    // Act
    // Call the method to be tested with the mock objects
    await commentController.deleteComment(mockReq, mockRes);

    // Assert
    // Check if the mock functions were called with the expected arguments and the expected response was sent
    expect(mockCommentService.deleteComment).toHaveBeenCalledWith(samplePid);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSend).toHaveBeenCalledWith(createRestResponse(200, "success", "Comment has been deleted successfully!", sampleDbRes));
  });

  test("deleteComment should send an error response if deleteComment returns null or undefined", async () => {
    // Arrange
    // Set up the mock functions to return null
    mockCommentService.deleteComment.mockResolvedValue(null);

    // Act
    // Call the method to be tested with the mock objects
    await commentController.deleteComment(mockReq, mockRes)
  });
})