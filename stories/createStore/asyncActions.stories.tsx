import React, { useEffect } from "react";
import { createStore } from "react-state-selector";

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
 * This interface is only for TypeScript usage
 * and separate definition of the initial state
 * is good practice.
 */

const initialState: IPosts = {
  state: FetchState.loading,
};

const Store = createStore(initialState, {
  actions: {},
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

export const AsyncActions = () => {
  const { posts, state, fetchError } = Store.useStore();

  useEffect(() => {
    Store.asyncActions.getPosts();
  }, []);

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
    <div>
      <button
        onClick={() => {
          Store.asyncActions.getPosts();
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
    </div>
  );
};

export default {
  title: "createStore",
};
