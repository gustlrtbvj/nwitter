import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fBase";
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL} from "@firebase/storage";
import React, { useState, useEffect, useRef } from "react";
import Nweet from "components/Nweet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


const NweetFactory  = ({ userObj }) => {

    const fileInput = useRef();
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("")

    useEffect(() => {
        // 실시간으로 데이터를 데이터베이스에서 가져오기
        const q = query(
        collection(getFirestore(), 'nweets'),
        // where('text', '==', 'hehe') // where뿐만아니라 각종 조건 이 영역에 때려부우면 됨
        orderBy('createdAt',"desc")
        );
        const unsubscribe = onSnapshot(q, querySnapshot => {
        const newArray = querySnapshot.docs.map(doc => {
        return {
        id: doc.id,
        ...doc.data(),
        };
        });
        setNweets(newArray);
        console.log('Current tweets in CA: ', newArray);
        });
        return () => {
        unsubscribe();
        };
        }, []);
        
        const onSubmit = async (event) => {
            if (nweet === "") {
                return;
              }
          event.preventDefault();
          let attachmentUrl = "";
          if (attachment !== "") {
          //파일 경로 참조 만들기
          const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
          //storage 참조 경로로 파일 업로드 하기
          const uploadFile = await uploadString(fileRef, attachment, "data_url");
          console.log(uploadFile);
          //storage에 있는 파일 URL로 다운로드 받기
          attachmentUrl = await getDownloadURL(uploadFile.ref);
          }
          
          //트윗할때, 메시지와 사진도 같이 firestore에 생성
          const nweetObj = {
          text: nweet,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          attachmentUrl,
          };
          await addDoc(collection(dbService, "nweets"), nweetObj);
          setNweet("");
          setAttachment("");
          fileInput.current.value = ""; 
        };

    const onChange = (event) => {
      const {
        target: { value },
      } = event;
      setNweet(value);
    };
    
    const onFileChange = (event) => {
        const {
          target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
              } = finishedEvent;
              setAttachment(result);
        };
        reader.readAsDataURL(theFile);
      };

      
      const onClearAttachment = () => { 
        setAttachment("");
        fileInput.current.value = ""; 
      };


    return (
      <div>
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">        
      <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
          <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
          />

          {attachment && (
        <div className="factoryForm__attachment">
        <img
          src={attachment}
          style={{
            backgroundImage: attachment,
          }}
        />
        <div className="factoryForm__clear" onClick={onClearAttachment}>
          <span>Remove</span>
          <FontAwesomeIcon icon={faTimes} />
        </div>
          </div>
        )}
        </form>
      </div>
    );
  };
export default NweetFactory ; 