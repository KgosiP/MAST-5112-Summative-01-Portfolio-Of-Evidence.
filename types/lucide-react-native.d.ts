import 'lucide-react-native';

declare module 'lucide-react-native' {
  export interface LucideProps {
    /**
     * Convenience prop exposed by lucide for setting the icon stroke color.
     * Upstream typings currently omit it, so we augment the interface here.
     */
    color?: string;
  }
}

