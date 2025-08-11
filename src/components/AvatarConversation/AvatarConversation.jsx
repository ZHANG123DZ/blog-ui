import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./AvatarConversation.module.scss";

export default function AvatarConversation({
  conversation = {},
  className = "headerAvatar",
  props,
}) {
  return (
    <>
      {conversation.is_group && !conversation.avatar_url ? (
        // Tính toán giá trị của avatar2 trước khi render JSX
        (() => {
          const avatar2 = conversation.users[1]?.avatar_url;
          const avatar1 = conversation.users[0]?.avatar_url; // Lấy một avatar khác để hiển thị

          return (
            <div
              style={{
                position: "relative",
                width: 40,
                height: 40,
              }}
              className={styles[className]}
              {...props}
            >
              <img
                src={avatar1}
                alt="avatar 1"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  position: "absolute",
                  left: 0,
                  top: 4,
                  border: "2px solid white",
                  boxSizing: "content-box",
                  backgroundColor: "#fff",
                }}
              />
              <img
                src={avatar2}
                alt="avatar 2"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  position: "absolute",
                  right: 0,
                  top: 0,
                  border: "2px solid white",
                  boxSizing: "content-box",
                  backgroundColor: "#fff",
                }}
              />
            </div>
          );
        })()
      ) : (
        <FallbackImage
          src={conversation.avatar_url}
          alt={conversation.name}
          className={styles[className]}
          {...props}
        />
      )}
    </>
  );
}
