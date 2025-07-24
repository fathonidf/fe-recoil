import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile | ReCoil"
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
