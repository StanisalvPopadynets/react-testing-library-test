import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Posts } from "./Posts";

const mockPostData = [
  {
    userId: 1,
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  },
  {
    userId: 1,
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
  },
  {
    userId: 1,
    id: 3,
    title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
  },
];

const mockNewPostData = {
  userId: 2,
  id: 17,
  title: "fugit voluptas sed molestias voluptatem provident",
  body: "eos voluptas et aut odit natus earum aspernatur fuga molestiae ullam deserunt ratione qui eos qui nihil ratione nemo velit ut aut id quo",
};

describe("Posts", () => {
  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      if (options?.method === "POST") {
        return Promise.resolve({
          json: () => Promise.resolve(mockNewPostData),
        });
      } else
        return Promise.resolve({
          json: () => Promise.resolve(mockPostData),
        });
    });
  });
  test("fetches and renders posts", async () => {
    render(<Posts />);

    expect(window.fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts"
    );

    await waitFor(() => {
      mockPostData.forEach((post) => {
        expect(screen.getByText(post.title)).toBeInTheDocument();
      });
    });
  });

  test("clicking on cancel hides the form and reset to default values", async () => {
    render(<Posts />);

    await waitFor(() => fireEvent.click(screen.getByText("Add New Post")));

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "New Post Title" },
    });
    expect(screen.queryByPlaceholderText("Title").value).toBe("New Post Title");

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByPlaceholderText("Cancel")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Add New Post"));
    expect(screen.queryByPlaceholderText("Title").value).toBe("");
  });

  test("creates and renders a post after submitting the form", async () => {
    render(<Posts />);

    await waitFor(() => fireEvent.click(screen.getByText("Add New Post")));

    const titleInput = screen.getByPlaceholderText("Title");
    const bodyInput = screen.getByPlaceholderText("Body");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    expect(titleInput.value).toBe("");
    expect(bodyInput.value).toBe("");
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(titleInput, { target: { value: mockNewPostData.title } });
    fireEvent.change(bodyInput, { target: { value: mockNewPostData.body } });

    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    expect(titleInput).not.toBeInTheDocument();
    expect(bodyInput).not.toBeInTheDocument();

    expect(screen.getByText(mockNewPostData.title)).toBeInTheDocument();
    expect(screen.getByText(mockNewPostData.body)).toBeInTheDocument();
  });
});
