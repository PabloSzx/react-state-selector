import React, { useEffect } from "react";
import { createStoreContext } from "react-state-selector";

enum FetchState {
  loading,
  complete,
  error,
}

interface IPosts {
  posts?: {
    id: number;
    title: string;
    body: string;
    userId: number;
  }[];
  state: FetchState;
  fetchError?: unknown;
}

/**
 * Only for TypeScript usage this interface
 * and separate definition of the initial state
 * is necessary / good practice.
 */

const initialState: IPosts = {
  state: FetchState.loading,
};

const Store = createStoreContext(initialState, {
  asyncActions: {
    getPosts: (produce) => async () => {
      try {
        produce((draft) => {
          draft.state = FetchState.loading;
        });

        const data = await (
          await fetch("https://jsonplaceholder.typicode.com/posts")
        ).json();

        produce((draft) => {
          draft.posts = data;
          draft.state = FetchState.complete;
        });
      } catch (err) {
        produce((draft) => {
          draft.state = FetchState.error;
          draft.fetchError = JSON.stringify(err);
        });
        console.error(err);
      }
    },
  },
});

export const AsyncActionsContext = () => {
  const { posts, state, fetchError } = Store.useStore();
  const { getPosts } = Store.useActions();

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  if (state === FetchState.error) {
    return (
      <p>
        Error!
        <br />
        {fetchError}
      </p>
    );
  }

  if (state === FetchState.loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <button
        onClick={() => {
          getPosts();
        }}
      >
        Get Data
      </button>
      <ol>
        {posts?.slice(0, 10).map((value) => {
          return (
            <li key={value.id}>
              <h3>{value.title}</h3>
              <p>{value.body}</p>
            </li>
          );
        })}
      </ol>
    </>
  );
};

export default {
  title: "createStoreContext",
};
