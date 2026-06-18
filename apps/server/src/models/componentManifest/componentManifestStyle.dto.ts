import { ApiProperty } from "@nestjs/swagger";

export class ComponentManifestStyleDto {
  @ApiProperty({ type: String })
  variantKey!: string;

  @ApiProperty({ type: String })
  cssProperty!: keyof ElementCSSInlineStyle["style"];

  @ApiProperty({ type: String })
  rawValue!: string;
}
// dto 대신 model로쓰자
// //TODO: default props 설정 (variant 기본값 설정 등등) , 함수명 builder? registerComponent?
// // 함수 형태 잡고(variant를 하나의 인자에 넣었다 뺏다는 되는데 , 다른 인자를 잡는 순간 무의미해짐)
// // componentBuilder -> 메타데이터 조금 적고 -> const {defineComponent,defineVariant} = componentBuilder({})(더좋은게 있는지 생각)
// //  말해준 부족한 부분 채우기
// // button.qubbi.tsx 이런식?
//TODO: variant가 없을떄 기본으로 할꺼 생각하면 구조 조금 바꿔야할듯
