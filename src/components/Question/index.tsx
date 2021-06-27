import React, { ReactNode } from "react";
import cn from "classnames";
import "./styles.scss";

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnsweared?: boolean;
  isHighlighted?: boolean;
};

export const Question = ({
  content,
  author,
  isAnsweared = false,
  isHighlighted = false,
  children,
}: QuestionProps) => {
  return (
    <div
      className={cn(
        "question",
        { answered: isAnsweared },
        { highlighted: isHighlighted && !isAnsweared }
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
};
