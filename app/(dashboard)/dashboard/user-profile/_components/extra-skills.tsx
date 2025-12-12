import { Card } from '@/components/ui/card'
import React, { useState } from 'react'
import { BsArrowUpRight } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'

export default function ExtraSkills() {
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [addedSkills, setAddedSkills] = useState<string[]>([])
  const [skillToDelete, setSkillToDelete] = useState('')
  const maxSkills = 10

  const handleAddSkill = () => {
    if (newSkill.trim() && addedSkills.length < maxSkills) {
      setAddedSkills([...addedSkills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleDeleteClick = (skill: string) => {
    setSkillToDelete(skill)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    setAddedSkills(addedSkills.filter(skill => skill !== skillToDelete))
    setShowDeleteModal(false)
  }

  const remainingSkills = maxSkills - addedSkills.length

  return (
    <div>
      <Card className='p-6'>
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-14">Extra Skills</h2>
          
          <p className="text-sm text-gray-500 mb-4">
          Showcase additional skills you can offer to enhance your exchanges.
        </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowModal(true)}
           className="px-3 py-1.5 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678]"
          >
            Add Skills
          </button>
        </div>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Extra Skills</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Input 
                placeholder="Skill (ex: Coding)" 
                className="mb-4"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                disabled={remainingSkills === 0}
              />
              <p className="text-sm text-gray-500">
                You can add {remainingSkills} more skills
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Suggested skills based off your profile</h3>
              <div className="flex flex-wrap gap-2">
                {addedSkills.map((skill, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 text-sm border rounded-full flex items-center gap-2 hover:bg-gray-50 group"
                  >
                    {skill}
                    <IoMdClose 
                      className="h-4 w-4 text-gray-400 group-hover:text-red-500 cursor-pointer" 
                      onClick={() => handleDeleteClick(skill)}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                onClick={handleAddSkill}
                className="px-4 py-2 text-sm text-white bg-[#20B894] rounded-md hover:bg-[#1a9678]"
                disabled={remainingSkills === 0 || !newSkill.trim()}
              >
                Add Skills
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this skill? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm text-gray-500 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
