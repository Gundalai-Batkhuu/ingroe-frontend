'use client'

import React, { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FileWithPath } from 'react-dropzone'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface FileUploaderProps {
  onFileUpload: (files: FileWithPath[]) => void
}

const SUPPORTED_EXTENSIONS = ['.md', '.pdf', '.docx', '.txt', '.csv', '.xlsx', '.xls']

function isSupportedFileType(file: File): boolean {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  return SUPPORTED_EXTENSIONS.includes(extension)
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [unsupportedCount, setUnsupportedCount] = useState(0)
  const [supportedCount, setSupportedCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dirInputRef = useRef<HTMLInputElement>(null)

  const processEntry = async (entry: FileSystemEntry): Promise<File[]> => {
    if (entry.isFile) {
      return new Promise((resolve) => {
        (entry as FileSystemFileEntry).file(file => resolve([file]))
      })
    } else if (entry.isDirectory) {
      const dirReader = (entry as FileSystemDirectoryEntry).createReader()
      return new Promise((resolve) => {
        dirReader.readEntries(async (entries) => {
          const files = await Promise.all(entries.map(processEntry))
          resolve(files.flat())
        })
      })
    }
    return []
  }

  const handleFiles = async (items: DataTransferItemList | FileList) => {
    let allFiles: File[] = []
    
    if (items instanceof FileList) {
      allFiles = Array.from(items)
    } else {
      const entries = Array.from(items)
        .filter(item => item.kind === 'file')
        .map(item => item.webkitGetAsEntry())
        .filter((entry): entry is FileSystemEntry => entry !== null)

      const processedFiles = await Promise.all(entries.map(processEntry))
      allFiles = processedFiles.flat()
    }

    const supportedFiles = allFiles.filter(isSupportedFileType) as FileWithPath[]
    setUnsupportedCount(allFiles.length - supportedFiles.length)
    setSupportedCount(supportedFiles.length)
    onFileUpload(supportedFiles)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.items)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleSelectFiles = () => {
    fileInputRef.current?.click()
  }

  const handleSelectDirectories = () => {
    dirInputRef.current?.click()
  }

  return (
    <>
      <h2 className="text-lg font-semibold">Upload Files and Folders</h2>
      <div
        className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          onChange={handleFileChange}
          multiple
          className="hidden"
          ref={fileInputRef}
          accept={SUPPORTED_EXTENSIONS.join(',')}
        />
        <Input
          type="file"
          onChange={handleFileChange}
          multiple
          className="hidden"
          ref={dirInputRef}
          webkitdirectory=""
          directory=""
        />
        <Upload className="size-12 text-gray-400 mx-auto mb-4" />
        <p className="text-sm text-gray-600 mb-4">
          Drag and drop files or folders here, or use the buttons below to select
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={handleSelectFiles}>Select Files</Button>
          <Button onClick={handleSelectDirectories}>Select Folders</Button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Supported file types: {SUPPORTED_EXTENSIONS.join(', ')}
        </p>
      </div>
      {(unsupportedCount > 0 || supportedCount > 0) && (
        <Alert variant="default" className="mt-4">
          <AlertDescription>
            {unsupportedCount > 0 && `${unsupportedCount} unsupported file${unsupportedCount > 1 ? 's were' : ' was'} ignored. `}
            {supportedCount > 0 && `${supportedCount} supported file${supportedCount > 1 ? 's have' : ' has'} been uploaded successfully.`}
            {supportedCount === 0 && 'No supported files were uploaded.'}
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}