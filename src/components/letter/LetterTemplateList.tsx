import { theme } from "@/styles/theme";
import Image from "next/image";
import styled, { css } from "styled-components";

interface LetterTemplateListProps {
  selectedTemplate: number;
  onChangeTemplate: (id: number) => void;
  templates: number[];
}

const LetterTemplateList = (props: LetterTemplateListProps) => {
  const { selectedTemplate, onChangeTemplate, templates } = props;

  const currentIndex = templates.findIndex(
    (template) => template === selectedTemplate
  );

  return (
    <>
      <TemplatesList>
        {templates.map((item) => (
          <TemplateImage
            key={item}
            src={`/assets/letter/background_${item}.png`}
            width={70}
            height={70}
            alt="편지지"
            $selected={selectedTemplate === item}
            onClick={() => onChangeTemplate(item)}
          />
        ))}
      </TemplatesList>
      <Page>
        <Current>{currentIndex + 1}</Current>/{templates.length}
      </Page>
    </>
  );
};

export default LetterTemplateList;

const TemplatesList = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  height: 78px;
  padding-left: 4px;
  margin-top: 69px;
  margin-bottom: 14px;
  overflow-x: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */

  @media (max-height: 740px) {
    margin-top: 30px;
    margin-bottom: 5px;
    ${theme.fonts.body14};
    gap: 11px;
  }

  @media (max-height: 680px) {
    margin-top: 15px;
    margin-bottom: 5px;
    ${theme.fonts.body14};
    gap: 11px;
  }

  @media (max-height: 628px) {
    margin-top: 12px;
    margin-bottom: 5px;
    ${theme.fonts.body14};
    gap: 11px;
  }
`;

const TemplateImage = styled(Image)<{ $selected: boolean }>`
  width: 70px;
  height: 70px;
  border-radius: 8px;
  box-sizing: content-box;

  ${({ $selected, theme }) =>
    $selected &&
    css`
      box-shadow: 0 0 0 4px ${theme.colors.sub03};
    `}

  @media (max-height: 628px) {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    ${({ $selected, theme }) =>
      $selected &&
      css`
        box-shadow: 0 0 0 2px ${theme.colors.sub03};
      `}
  }
`;

const Page = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  color: ${theme.colors.gray500};
  ${theme.fonts.caption03};
`;

const Current = styled.span`
  color: ${theme.colors.white};
  margin-bottom: 100px;

  @media (max-height: 628px) {
    margin-bottom: 50px;
  }
`;
