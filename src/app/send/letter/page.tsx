"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Toast from "@/components/common/Toast";
import { getDraftCount, getDraftLetter, postDraftKey } from "@/api/send/send";
import DraftBottom from "@/components/send/DraftBottom";
import { draftState, sendLetterState } from "@/recoil/letterStore";
import { useRecoilState, useRecoilValue } from "recoil";

const SendLetterPage = () => {
  const router = useRouter();
  const [draftId, setDraftId] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const [letterState, setLetterState] = useRecoilState(sendLetterState);
  const [tempCount, setTempCount] = useState<number>(3);
  const [isDraftBottom, setIsDraftBottom] = useState<boolean>(false);

  const draftKey = useRecoilValue(draftState);

  const fetchPostDraftKey = async () => {
    if (draftKey) {
      try {
        const response = await postDraftKey();
        setDraftId(response.data.draftId);
        console.log("임시 저장 키 발급 성공", response);
      } catch {
        console.log("임시 저장 키 발급 실패");
      }
    }
  };

  const fetchGetDraft = async () => {
    if (draftKey) {
      try {
        const response = await getDraftLetter(draftKey);
        console.log("임시 저장 편지 조회 성공", response);
      } catch {
        console.log("임시 저장 편지 조회 실패");
      }
    }
  };

  useEffect(() => {
    const fetchGetDraftCount = async () => {
      try {
        const response = await getDraftCount();
        setTempCount(response.data.count);
        console.log("임시 저장 개수 조회 성공", response);
      } catch {
        console.log("임시 저장 개수 조회 실패");
      }
    };

    fetchGetDraftCount();

    if (draftKey) {
      fetchGetDraft();
    }

    fetchPostDraftKey();
  }, []);

  const handleReceiverChange = (newValue: string) => {
    setReceiver(newValue);
  };

  const handleContentChange = (newValue: string) => {
    if (newValue.length <= 1000) {
      setContent(newValue);
    }
  };

  const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedImages: File[] = Array.from(files).slice(0, 4);
      if (images.length + selectedImages.length > 4) {
        handleShowToast();
        return;
      }
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const handleDeleteImages = (id: number) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== id));
  };

  /* 임시 저장 */
  const handleDraftBottom = () => {
    setIsDraftBottom(!isDraftBottom);
  };

  /* 토스트 메세지 */
  const handleShowToast = () => {
    setIsButtonDisabled(true);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleAddNext = () => {
    /* 다음 페이지 */
    setLetterState({
      draftId: draftId,
      receiverName: receiver,
      content: content,
      images: images.map((img) =>
        img instanceof File ? URL.createObjectURL(img) : img
      ), // 이미지 URL로 저장
      templateType: 0,
    });
    router.push("/send/template");
  };

  return (
    <Layout>
      <NavigatorBarWrapper>
        <NavigatorBar title="편지 보내기" cancel={false} />
        <StorageButton onClick={handleDraftBottom}>
          임시저장{` `}I{` `}
          {tempCount}
        </StorageButton>
      </NavigatorBarWrapper>
      <Container>
        <Essential>* 필수</Essential>
        <Column>
          <Label>편지를 받을 이의 실명을 입력해주세요 *</Label>
          <Input
            inputType="boxText"
            value={receiver}
            onChange={handleReceiverChange}
            placeholder="ex) 홍길동"
          />
        </Column>
        <Column>
          <Label>
            편지 내용을 작성해주세요 *
            <Count>
              <Span>{content.length}</Span>
              /1000
            </Count>
          </Label>
          <Input
            inputType="boxTextArea"
            value={content}
            onChange={handleContentChange}
            placeholder="최대 1000자까지 입력이 가능해요"
            height="193px"
          />
        </Column>
        <Column>
          <Label>사진을 추가해주세요</Label>
          {images.length === 0 ? (
            <AddImageWrapper>
              <AddImageLabel>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddImages}
                  style={{ display: "none" }}
                />
                + 사진 불러오기 (선택)
              </AddImageLabel>
              <SmallText>최대 4장까지 사진 첨부가 가능해요</SmallText>
            </AddImageWrapper>
          ) : (
            <ImagesList>
              <AddImagesLabel>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddImages}
                  style={{ display: "none" }}
                  disabled={isButtonDisabled}
                />
                +<br />
                {images.length}/4
              </AddImagesLabel>
              <ImagesWrapper>
                {images.map((image, index) => (
                  <ImageDiv>
                    <Image
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      width={52}
                      height={52}
                      alt="images"
                      style={{ borderRadius: "8px" }}
                    />
                    <DeleteIcon onClick={() => handleDeleteImages(index)}>
                      <Image
                        src="/assets/icons/ic_image_delete.svg"
                        width={20}
                        height={20}
                        alt="delete"
                      />
                    </DeleteIcon>
                  </ImageDiv>
                ))}
              </ImagesWrapper>
            </ImagesList>
          )}
        </Column>
        {showToast && (
          <Toast
            text="사진 첨부는 최대 4장까지 가능해요."
            icon={true}
            bottom="113px"
            left="50%"
          />
        )}
        <ButtonWrapper>
          <Button
            buttonType="primary"
            size="large"
            text="다음"
            disabled={!receiver || !content}
            onClick={handleAddNext}
          />
        </ButtonWrapper>
      </Container>
      {isDraftBottom && <DraftBottom onClose={handleDraftBottom} />}
    </Layout>
  );
};

export default SendLetterPage;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  gap: 7px;
  padding: 20px;
  background-color: ${theme.colors.bg};
  position: relative;
`;

const NavigatorBarWrapper = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  position: relative;
  margin-bottom: 25px;
`;

const StorageButton = styled.button`
  display: inline-flex;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 200px;
  background: ${theme.colors.sub01};
  color: ${theme.colors.gray200};
  ${theme.fonts.caption03};

  position: absolute;
  top: 6.5px;
  right: 0px;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Essential = styled.div`
  text-align: right;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.caption03};
  margin-bottom: 17px;
`;

const Column = styled.div`
  margin-bottom: 40px;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.subtitle};
  margin-bottom: 20px;
`;

const Count = styled.div`
  display: flex;
  color: ${theme.colors.gray400};
  ${theme.fonts.body09};
`;

const Span = styled.span`
  color: ${theme.colors.white};
`;

const AddImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
`;

const AddImageLabel = styled.label`
  width: 100%;
  height: 57px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
  border-radius: 12px;
  background: ${theme.colors.gray700};
  color: ${theme.colors.gray400};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  ${theme.fonts.body08}
  margin-top: 16px;
`;

const SmallText = styled.div`
  color: ${theme.colors.gray500};
  ${theme.fonts.caption04};
`;

const AddImagesLabel = styled.label`
  width: 52px;
  height: 52px;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: ${theme.colors.gray700};
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.body08};
  text-align: center;
`;

const ImagesList = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
`;

const ImagesWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 13px;
`;

const ImageDiv = styled.div`
  width: 52px;
  height: 52px;
  position: relative;
`;

const DeleteIcon = styled.button`
  width: 20px;
  height: 20px;
  position: absolute;
  top: -5px;
  right: -5px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
