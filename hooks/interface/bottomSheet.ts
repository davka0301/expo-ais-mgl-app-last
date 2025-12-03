export interface Props {
  icon: any;
  title: string;
  subtitle: string;
  onCancel: () => void;
  onNext: (value?: any) => void;
}
