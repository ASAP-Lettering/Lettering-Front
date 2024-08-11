# Ground Rule
## 기술 스택

- 프레임워크: Next.js
- 언어: TypeScript
- 패키지 매니저: npm
- CSS 프레임워크: styled-components
- 전역상태관리: Recoil
- 통신: Axios
- 그외: Lint & Prettier

<br/>

## 배포

- **Vercel**

<br/>

## 폴더 구조

```
src
 ├─ api
 ├─ app
     ├── 페이지별 디렉토리
     ├── layout.tsx
     └── page.tsx
 ├─ components                   			 
     ├── common
     └── 페이지별 컴포넌트
 ├─ constants
 ├─ hooks
 ├─ lib
 ├─ recoil
 ├─ styles
 ├─ types
 └─ utils
```

<br/>

## Git Conventions

### Issue 생성

- **issue templete > 양식 맞추어 작성, Assignees 본인 선택, Labels 선택**
- type: **대문자**로 시작 (ex. **F**eat, **D**esign, **C**hore 등)
- 타입별로 이슈 템플릿 만들어두었으니 그렇게 이용하시면 좀 더 편할 거예요!
- 내용 없으면 지우고, TODO에 상세 내용 다 작성하기 (세부적으로 할 일 모두 작성)
    
    ![image](https://github.com/user-attachments/assets/fece48bc-68db-4e39-9b13-02560bb20bc9)

    

- **Labels**

![image](https://github.com/user-attachments/assets/1c4e8063-d0e0-44a5-a28f-14d7e19ec54d)

<br/>

### Branch 생성

- Issue 기반 브랜치 생성 후 작업
    
    : 이슈 번호에 맞게 브랜치 생성하기 (develop 브랜치에서 새로 생성)
    
- **브랜치명**
: **type(#이슈번호)**
    - 브랜치명은 **소문자**로!
    ex) **f**eat(#12), **a**pi(#63)

```
브랜치 생성 및 이동
git checkout -b 브랜치명
```

- 브랜치 종류
    
    ### |  **branch 종류**
    
    - `main`: 배포 브랜치
    - `develop`: 개발 브랜치
    - `type(#이슈번호)`: 세부 개발 브랜치
    <br/>
    
    | type | 의미 |
    | --- | --- |
    | feat | 새로운 기능 추가 |
    | design | 사용자 UI 및 CSS 파일 추가 · 수정 |
    | chore | 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore |
    | fix | 버그 수정 |
    | style | 코드의 구조,형식 개선 (코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우) |
    | docs | 문서 수정 |
    | refactor | 코드 리팩토링 |
    | test | 테스트 코드, 리팩토링 테스트 코드 추가 |
    | comment | comment 필요한 주석 추가 및 변경 |
    | file | 파일 또는 폴더명 수정, 이동, 삭제 등의 작업만 수행한 경우 |
    | !hotfix | 급하게 치명적인 버그를 고쳐야 하는 경우 |

<br/>

### Commit 규칙

- Commit 메세지 <br/>
  **GitMoji(✨, 🐛 등)** **type(#이슈번호): 작업 내용**
- ex) ✨ **feat(#5)**: 검색 결과 필터링 기능 추가
- 깃모지 (Gitmoji) : 커밋 메시지를 위한 이모지 가이드로, **시각적인 강조**를 통해 **가독성** 높은 커밋 메시지를 작성할 수 있다. <br/>
                     **→ Label의 이모지를 참고하여 삽입!**

```tsx
git add .
git commit -m "gitmoji type(예: ✨ feat, ⚙ chore)(#이슈번호): 작업 내용"
git push origin 현재 작업 브랜치명
```

<br/>

### Pull Request 규칙


```
자주 커밋하고 PR은 300자가 넘지 않도록 주의! (자주 PR)
```

- **develop 브랜치**로 PR 날리기
    
   ![image](https://github.com/user-attachments/assets/adf3ac33-4381-44f2-8db0-6a32cf4281c3)

    
- PR 제목은 commit 메세지랑 똑같이
    - 제목: **[Feat]** 핵심적인 부분만 간략하게
    - 내용: 간결하게 리스트 방식으로
- merge는 reviewer가 해주기 <br/>
: 코드 관련 수정사항, 질문 등 코멘트 남기기

<br/>

### 팀원 리뷰 후 Merge

→ PR 리뷰 시에는 해당 브랜치로 checkout 한 후 확인
<br/>
→ Merge는 리뷰어가 진행

<br/>

### Issue 닫기

- Merge 후, 자동 닫힘
