const { Comment, Like, Post, Profile, User } = require("./index");
const { db } = require("./db/connection.js");

describe("Social Sequelzie Test", () => {
  /**
   * Runs the code prior to all tests
   */
  beforeAll(async () => {
    // the 'sync' method will create tables based on the model class
    // by setting 'force:true' the tables are recreated each time the test suite is run
    await db.sync({ force: true });
  });

  test("can create a User", async () => {
    const user1 = await User.create({
      username: "emart",
      email: "test@test.com",
    });
    expect(user1).toEqual(
      expect.objectContaining({
        username: "emart",
        email: "test@test.com",
      })
    );
  });

  test("can create a Profile", async () => {
    const profile1 = await Profile.create({
      bio: "test test test",
      profilePicture: "test/img",
      birthday: "01/01/01",
    });
    expect(profile1).toEqual(
      expect.objectContaining({
        bio: "test test test",
        profilePicture: "test/img",
        birthday: "01/01/01",
      })
    );
  });

  test("can create a Post", async () => {
    const post1 = await Post.create({
      title: "test",
      body: "test test test",
    });
    expect(post1).toEqual(
      expect.objectContaining({
        title: "test",
        body: "test test test",
      })
    );
  });

  test("can create a Comment", async () => {
    const comment1 = await Comment.create({
      body: "test test",
    });
    expect(comment1).toEqual(
      expect.objectContaining({
        body: "test test",
      })
    );
  });

  test("can create a Like", async () => {
    const like1 = await Like.create({
      reactionType: "happy",
    });
    expect(like1).toEqual(
      expect.objectContaining({
        reactionType: "happy",
      })
    );
  });

  test("User and Profile association", async () => {
    const user1 = await User.create({
      username: "emart",
      email: "test@test.com",
    });
    const profile1 = await Profile.create({
      bio: "test test test",
      profilePicture: "test/img",
      birthday: "01/01/01",
    });
    await user1.setProfile(profile1);
    const test = await user1.getProfile();
    expect(test instanceof Profile).toBe(true);
  });

  test("User and Post association", async () => {
    const user1 = await User.create({
      username: "emart",
      email: "test@test.com",
    });
    const post1 = await Post.create({
      title: "test",
      body: "test test test",
    });
    const post2 = await Post.create({
      title: "test",
      body: "test test test",
    });
    await user1.addPosts([post1, post2]);
    const test = await user1.getPosts();
    expect(test.length).toBe(2);
    expect(test[0] instanceof Post).toBe(true);
  });

  test("Post and Comments association", async () => {
    const post1 = await Post.create({
      title: "test",
      body: "test test test",
    });
    const comment1 = await Comment.create({
      body: "test test",
    });
    const comment2 = await Comment.create({
      body: "test test",
    });
    await post1.addComments([comment1, comment2]);
    const test = await post1.getComments();
    expect(test.length).toBe(2);
    expect(test[0] instanceof Comment).toBe(true);
  });

  test("User and Like association", async () => {
    const user1 = await User.create({
      username: "emart",
      email: "test@test.com",
    });
    const user2 = await User.create({
      username: "emart",
      email: "test@test.com",
    });
    const like1 = await Like.create({
      reactionType: "happy",
    });
    const like2 = await Like.create({
      reactionType: "happy",
    });
    await user1.addLikes([like1, like2]);
    const test = await user1.getLikes();
    expect(test.length).toBe(2);
    expect(test[0] instanceof Like).toBe(true);
    await like1.addUsers([user1, user2]);
    const test2 = await like1.getUsers();
    expect(test2.length).toBe(2);
    expect(test2[0] instanceof User).toBe(true);
  });
});
