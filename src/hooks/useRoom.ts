import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId?: string;
};

export const useRoom = (roomId: string) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    // once - ouve uma vez
    // on - fica ouvindo
    // child added
    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, value]) => value.authorId === user?.id
            )?.[0],
          };
        }
      );

      setQuestions(parsedQuestions);
      setTitle(databaseRoom.title);
    });

    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id]);

  return {
    title,
    questions,
  };
};
