"use client";

import React, { Suspense, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { registerLetterState } from "@/recoil/letterStore";
import { useToast } from "@/hooks/useToast";
import { postImage } from "@/api/image/image";
import imageCompression from "browser-image-compression";
import Loader, { LoaderContainer } from "@/components/common/Loader";

const LetterRegisterPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [sender, setSender] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<string[]>([]); // 서버 전송용
  const [previewImages, setPreviewImages] = useState<string[]>([]); // 미리보기용
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isImageUploadLoading, setImageUploadLoading] =
    useState<boolean>(false); // 서버 이미지 업로드 상태

  const [letterState, setLetterState] = useRecoilState(registerLetterState);
  const [isToastShown, setIsToastShown] = useState(false);
  const searchParams = useSearchParams();
  const letterId = searchParams.get("letterId");
  const independent = searchParams.get("independent");

  useEffect(() => {
    if (letterState) {
      setSender(letterState.senderName);
      setContent(letterState.content);
      setImages(letterState.images);
      setPreviewImages(letterState.previewImages);
    }
  }, [letterState]);

  const handleSenderChange = (newValue: string) => {
    setSender(newValue);
    setLetterState((prevState) => ({
      ...prevState,
      senderName: newValue,
    }));
  };

  const handleContentChange = (newValue: string) => {
    const maxLength = 1000;
    if (newValue.length > maxLength) {
      setContent(newValue.substring(0, maxLength));
    } else {
      setContent(newValue);
    }
    setLetterState((prevState) => ({
      ...prevState,
      content: newValue,
    }));
  };

  const handleShowToast = () => {
    /* 토스트 메세지 보여지기 전*/
    if (previewImages.length >= 4 && !isToastShown) {
      showToast("사진 첨부는 최대 4장까지 가능해요.", {
        icon: true,
        close: false,
        bottom: "113px",
      });
      setIsToastShown(true);
    }
  };

  const handleAddImages = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const selectedImages: File[] = Array.from(files);
      const existingImageCount = (previewImages || []).length;

      // 총 이미지 개수를 4개로 제한
      const additionalImagesNeeded = Math.max(0, 4 - existingImageCount);

      // 초과된 이미지는 제외한 업로드 가능한 이미지
      const validImages = selectedImages.slice(0, additionalImagesNeeded);

      // 미리보기 이미지 업데이트
      const newPreviewImages = [
        ...(previewImages || []),
        ...validImages.map((file) => URL.createObjectURL(file)),
      ];

      setPreviewImages(newPreviewImages);

      // 총 이미지가 4개를 초과하려고 할 때 (토스트 메세지 보여지기 전)
      if (selectedImages.length > additionalImagesNeeded && !isToastShown) {
        showToast("사진 첨부는 최대 4장까지 가능해요.", {
          icon: true,
          close: false,
          bottom: "113px",
        });
        setIsToastShown(true);
        setIsButtonDisabled(false);
      }

      const imageUrls: string[] = [];
      for (const file of validImages) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 512,
          useWebWorker: true,
        });

        try {
          setImageUploadLoading(true);

          const response = await postImage(compressedFile);
          console.log("이미지 업로드 성공", response.data);
          imageUrls.push(response.data.imageUrl);
        } catch (error) {
          console.error("이미지 업로드 실패", error);
        }
      }
      setImages((prevImages) => [...prevImages, ...imageUrls]);
      setImageUploadLoading(false);

      setLetterState((prevState) => ({
        ...prevState,
        images: [...(prevState.images || []), ...imageUrls],
        previewImages: newPreviewImages,
      }));
    }
  };

  const handleDeleteImages = (id: number) => {
    const updatedImages = images.filter((_, index) => index !== id);
    const updatedPreviewImages = previewImages.filter(
      (_, index) => index !== id
    );

    if (previewImages.length - 1 < 4) {
      setIsButtonDisabled(false);
    }

    // 상태 업데이트
    setImages(updatedImages);
    setPreviewImages(updatedPreviewImages);

    // setLetterState에 변경된 상태 반영
    setLetterState((prevState) => ({
      ...prevState,
      images: updatedImages,
      previewImages: updatedPreviewImages,
    }));
  };

  useEffect(() => {
    console.log("images", images);
    console.log("previewImages", previewImages);
  }, [images, previewImages]);

  const handleAddNext = async () => {
    /* 다음 페이지 */
    setLetterState((prevState) => ({
      ...prevState,
      senderName: sender,
      content: content,
      images: images,
      previewImages: previewImages,
    }));
    if (letterId) {
      if (independent === "true") {
        router.push(`/letter/template?letterId=${letterId}&independent=true`);
      } else {
        router.push(`/letter/template?letterId=${letterId}`);
      }
    } else {
      router.push("/letter/template");
    }
  };

  return (
    <Layout>
      <NavigatorBar
        title={letterId ? "편지 수정하기" : "새 편지 등록하기"}
        cancel={false}
      />
      <Container>
        <Essential>* 필수</Essential>
        <Column>
          <Label>편지를 보낸 사람은 누구인가요? *</Label>
          <Input
            inputType="boxText"
            value={sender}
            onChange={handleSenderChange}
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
          <Label $show={false}>사진을 추가해주세요</Label>
          {(previewImages || []).length === 0 ? (
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
              <AddImagesLabel onClick={handleShowToast}>
                {previewImages.length < 4 && (
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImages}
                    style={{ display: "none" }}
                    disabled={isButtonDisabled}
                  />
                )}
                +<br />
                {previewImages.length}/4
              </AddImagesLabel>
              <ImagesWrapper>
                {previewImages.map((image, index) => (
                  <ImageDiv>
                    <Image
                      src={image}
                      fill
                      alt="images"
                      style={{ borderRadius: "8px" }}
                    />
                    <DeleteIcon onClick={() => handleDeleteImages(index)}>
                      <Image
                        src="/assets/icons/ic_image_delete.svg"
                        fill
                        alt="delete"
                      />
                    </DeleteIcon>
                  </ImageDiv>
                ))}
              </ImagesWrapper>
            </ImagesList>
          )}
        </Column>
        <ButtonWrapper>
          <Button
            buttonType="primary"
            size="large"
            text={isImageUploadLoading ? "Loading..." : "다음"}
            disabled={
              !sender ||
              (!content && previewImages?.length === 0) ||
              isImageUploadLoading
            }
            onClick={handleAddNext}
          />
        </ButtonWrapper>
      </Container>
    </Layout>
  );
};

export default function LetterRegisterPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <LetterRegisterPage />
    </Suspense>
  );
}

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

  @media (max-height: 550px) {
    padding-top: 0px;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Essential = styled.div`
  text-align: right;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.caption03};
  margin-top: 25px;
  margin-bottom: 17px;

  @media (max-height: 790px) {
    margin: 0;
    position: absolute;
    right: 24px;
  }
`;

const Column = styled.div`
  margin-bottom: 40px;

  @media (max-height: 710px) {
    margin-bottom: 20px;
  }
`;

const Label = styled.div<{ $show?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.subtitle};
  margin-bottom: 12px;

  @media (max-height: 628px) {
    ${theme.fonts.body6}
    margin-bottom: 12px;
    ${({ $show }) =>
      $show === false &&
      css`
        display: none;
        margin-bottom: 0px;
      `}
  }

  @media (max-height: 580px) {
    ${theme.fonts.body10};
    margin-bottom: 8px;
  }
`;

const Count = styled.div`
  display: flex;
  color: ${theme.colors.gray400};
  ${theme.fonts.body09};

  @media (max-height: 628px) {
    ${theme.fonts.body11};
  }
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

  @media (max-height: 628px) {
    height: 48px;
    ${theme.fonts.body12};
  }

  @media (max-height: 580px) {
    height: 42px;
    ${theme.fonts.caption04}
  }
`;

const SmallText = styled.div`
  color: ${theme.colors.gray500};
  ${theme.fonts.caption04};
  text-align: center;
  margin-bottom: 100px;

  @media (max-height: 550px) {
    display: none;
  }
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

  @media (max-height: 628px) {
    width: 45px;
    height: 45px;
    ${theme.fonts.body12};
  }

  @media (max-height: 580px) {
    width: 39px;
    height: 39px;
    ${theme.fonts.body12};
  }
`;

const ImagesList = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  margin-bottom: 100px;

  @media (max-height: 628px) {
    margin-top: 0px;
  }
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

  @media (max-height: 628px) {
    width: 45px;
    height: 45px;
  }

  @media (max-height: 580px) {
    width: 39px;
    height: 39px;
  }
`;

const DeleteIcon = styled.button`
  width: 20px;
  height: 20px;
  position: absolute;
  top: -5px;
  right: -5px;

  @media (max-height: 628px) {
    width: 18px;
    height: 18px;
  }

  @media (max-height: 580px) {
    width: 13px;
    height: 13px;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
  z-index: 1000;
`;
